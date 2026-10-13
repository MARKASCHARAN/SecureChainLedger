// src/modules/ledger/reconciler.service.js
// Background outbox reconciler worker.
// Bridges PostgreSQL outbox events to Hyperledger Fabric transactions with guaranteed delivery.

import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';
import { ledgerService } from './ledger.service.js';
import { fabricClient } from './fabric-gateway.client.js';

let reconcilerTimer = null;
let isReconciling = false;

/**
 * Maps an OutboxEvent to its corresponding chaincode function invocation.
 */
async function processOutboxEvent(event) {
  const { eventType, aggregateId, payload } = event;

  let fcn = '';
  let args = [];

  switch (eventType) {
    case 'BATCH_CREATED':
      fcn = 'CreateBatch';
      args = [
        payload.batchNumber || aggregateId,
        payload.productId || '',
        payload.manufacturerId || '',
        String(payload.quantity || 1),
        '0',
        payload.manufacturedAt || '',
        payload.expiresAt || '',
        '',
      ];
      break;

    case 'BATCH_APPROVED':
      fcn = 'ApproveBatch';
      args = [
        payload.batchNumber || aggregateId,
        payload.qaDocumentHash || '',
      ];
      break;

    case 'CUSTODY_TRANSFERRED':
      fcn = 'TransferCustody';
      args = [
        payload.batchNumber || payload.batchId || aggregateId,
        payload.transferId || '',
        payload.receiverId || '',
        String(payload.quantity || 1),
        payload.notes || '',
      ];
      break;

    case 'RECEIPT_CONFIRMED':
      fcn = 'ConfirmReceipt';
      args = [
        payload.batchNumber || payload.batchId || aggregateId,
        payload.transferId || '',
        payload.notes || '',
      ];
      break;

    case 'RECALL_INITIATED':
      fcn = 'InitiateRecall';
      args = [
        payload.batchNumber || payload.batchId || aggregateId,
        payload.reason || 'Recall Order',
        'CLASS_I',
        payload.initiatedByOrg || '',
      ];
      break;

    case 'RECALL_ACKNOWLEDGED':
      fcn = 'AcknowledgeRecall';
      args = [
        payload.batchNumber || payload.batchId || aggregateId,
        payload.holderOrg || '',
        '0',
        payload.notes || '',
      ];
      break;

    default:
      logger.warn({ eventType }, 'Unrecognized outbox event type; skipping chaincode mapping');
      fcn = 'RecordGenericEvent';
      args = [eventType, aggregateId];
  }

  // 1. Submit to Fabric
  const result = await fabricClient.submitTransaction(fcn, ...args);

  // 2. Check if batch foreign key exists before assigning
  const candidateBatchId = payload.batchId || aggregateId;
  const batchRecord = candidateBatchId
    ? await prisma.batch.findUnique({ where: { id: candidateBatchId }, select: { id: true } }).catch(() => null)
    : null;

  // Persist confirmed LedgerTransaction audit row
  await prisma.ledgerTransaction.create({
    data: {
      batchId: batchRecord ? candidateBatchId : null,
      eventType: eventType,
      status: 'CONFIRMED',
      fabricTxId: result.txId,
      payload: event.payload,
      confirmedAt: new Date(),
    },
  });

  // 3. Update any associated entity ledger status
  if (payload.transferId) {
    await prisma.transfer.updateMany({
      where: { id: payload.transferId },
      data:  { ledgerTxStatus: 'CONFIRMED', ledgerTxId: result.txId },
    }).catch(() => {});
  }

  if (payload.recallId) {
    await prisma.recall.updateMany({
      where: { id: payload.recallId },
      data:  { ledgerTxStatus: 'CONFIRMED', ledgerTxId: result.txId },
    }).catch(() => {});
  }

  // 4. Mark outbox event processed
  await ledgerService.markOutboxProcessed(event.id);

  logger.info(
    { eventId: event.id, eventType, txId: `0x${result.txId.slice(0, 16)}...` },
    'Outbox event reconciled to ledger'
  );

  return result;
}

/**
 * Runs a single reconciliation pass over pending outbox events.
 */
export async function reconcileOnce(maxRetries = 3, batchSize = 25) {
  if (isReconciling) return { processed: 0, failed: 0 };
  isReconciling = true;

  let processed = 0;
  let failed = 0;

  try {
    const pendingEvents = await ledgerService.getPendingOutboxEvents(maxRetries, batchSize);

    for (const event of pendingEvents) {
      try {
        await processOutboxEvent(event);
        processed++;
      } catch (err) {
        failed++;
        logger.error({ err, eventId: event.id }, 'Failed to reconcile outbox event');
        await ledgerService.markOutboxFailed(event.id).catch(() => {});
      }
    }
  } finally {
    isReconciling = false;
  }

  return { processed, failed };
}

/**
 * Starts the background polling reconciler timer.
 */
export function startReconciler({ intervalMs = 5000, batchSize = 25 } = {}) {
  if (reconcilerTimer) return;

  logger.info({ intervalMs }, 'Starting background Ledger Outbox Reconciler worker');
  reconcilerTimer = setInterval(async () => {
    try {
      await reconcileOnce(3, batchSize);
    } catch (err) {
      logger.error(err, 'Error in background reconciler loop');
    }
  }, intervalMs);
}

/**
 * Stops the background reconciler worker.
 */
export function stopReconciler() {
  if (reconcilerTimer) {
    clearInterval(reconcilerTimer);
    reconcilerTimer = null;
    logger.info('Stopped Ledger Outbox Reconciler worker');
  }
}
