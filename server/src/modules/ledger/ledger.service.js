// src/modules/ledger/ledger.service.js
// Ledger service abstraction.
//
// Phase 1: All events are persisted to the OutboxEvent table with status PENDING.
//          A background reconciler (Phase 2) will pick them up and submit to Fabric Gateway.
//
// Phase 2: Replace submitToFabric() with actual @hyperledger/fabric-gateway calls.
//          The interface contract below remains stable across both phases.

import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';

/**
 * Persists a ledger event to the outbox.
 * The event will be processed by the reconciler — never call Fabric directly here.
 *
 * @param {string} eventType  - LedgerEventType enum value
 * @param {string} aggregateId - Typically the batchId or transferId
 * @param {object} payload     - Business data to anchor on chain
 */
async function enqueueEvent(eventType, aggregateId, payload) {
  const event = await prisma.outboxEvent.create({
    data: { eventType, aggregateId, payload },
  });

  logger.debug({ eventId: event.id, eventType, aggregateId }, 'Ledger event enqueued');
  return event;
}

/**
 * Records a LedgerTransaction row with PENDING status for a specific batch.
 * Call this when you need to track on-chain confirmation per-batch.
 *
 * @param {string} batchId
 * @param {string} eventType - LedgerEventType enum value
 * @param {object} payload
 */
async function recordPendingTx(batchId, eventType, payload) {
  const tx = await prisma.ledgerTransaction.create({
    data: { batchId, eventType, status: 'PENDING', payload },
  });
  return tx;
}

/**
 * Marks a LedgerTransaction as CONFIRMED once Fabric returns a tx ID.
 * Called by the reconciler in Phase 2.
 *
 * @param {string} ledgerTxId  - Internal DB ID of the LedgerTransaction row
 * @param {string} fabricTxId  - Transaction ID returned by Fabric Gateway
 */
async function confirmTx(ledgerTxId, fabricTxId) {
  return prisma.ledgerTransaction.update({
    where: { id: ledgerTxId },
    data: { status: 'CONFIRMED', fabricTxId, confirmedAt: new Date() },
  });
}

/**
 * Marks a LedgerTransaction as FAILED.
 * @param {string} ledgerTxId
 * @param {string} errorMsg
 */
async function failTx(ledgerTxId, errorMsg) {
  return prisma.ledgerTransaction.update({
    where: { id: ledgerTxId },
    data: { status: 'FAILED', errorMsg, retryCount: { increment: 1 } },
  });
}

/**
 * Queries pending outbox events for the reconciler to process.
 * Returns events that have not been processed and have failed fewer than maxRetries times.
 *
 * @param {number} maxRetries
 * @param {number} batchSize
 */
async function getPendingOutboxEvents(maxRetries = 3, batchSize = 50) {
  return prisma.outboxEvent.findMany({
    where: { processedAt: null, failedAt: null, retryCount: { lt: maxRetries } },
    orderBy: { createdAt: 'asc' },
    take: batchSize,
  });
}

/**
 * Marks an outbox event as successfully processed.
 * @param {string} eventId
 */
async function markOutboxProcessed(eventId) {
  return prisma.outboxEvent.update({
    where: { id: eventId },
    data: { processedAt: new Date() },
  });
}

/**
 * Marks an outbox event as failed.
 * @param {string} eventId
 */
async function markOutboxFailed(eventId) {
  return prisma.outboxEvent.update({
    where: { id: eventId },
    data: { failedAt: new Date(), retryCount: { increment: 1 } },
  });
}

// ─── Phase 2 stub — replace with Fabric Gateway implementation ────────────────
//
// import { connect } from '@hyperledger/fabric-gateway';
//
// async function submitToFabric(channelName, chaincodeName, fcn, args) {
//   // 1. Load identity from wallet
//   // 2. Connect via fabric-gateway
//   // 3. Submit transaction
//   // 4. Return fabricTxId
// }
// ─────────────────────────────────────────────────────────────────────────────

export const ledgerService = {
  enqueueEvent,
  recordPendingTx,
  confirmTx,
  failTx,
  getPendingOutboxEvents,
  markOutboxProcessed,
  markOutboxFailed,
};
