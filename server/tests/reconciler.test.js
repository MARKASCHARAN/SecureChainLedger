// tests/reconciler.test.js
// Integration test for the Ledger Outbox Reconciler worker.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/lib/prisma.js';
import { ledgerService } from '../src/modules/ledger/ledger.service.js';
import { reconcileOnce } from '../src/modules/ledger/reconciler.service.js';

let orgId, prodId, testBatchId;
const TS = Date.now();

beforeAll(async () => {
  const org = await prisma.organization.create({
    data: { name: `Reconciler Org ${TS}`, type: 'MANUFACTURER', status: 'ACTIVE' },
  });
  orgId = org.id;

  const prod = await prisma.product.create({
    data: {
      genericName:   `Reconciler Drug ${TS}`,
      brandName:     `RDrug-${TS}`,
      formulation:   'Tablet',
      strength:      '50mg',
      manufacturerId: orgId,
    },
  });
  prodId = prod.id;

  const batch = await prisma.batch.create({
    data: {
      batchNumber:    `REC-BATCH-${TS}`,
      productId:      prodId,
      manufacturerId: orgId,
      currentOwnerId: orgId,
      quantity:       1000,
      unitPrice:      20.0,
      status:         'APPROVED',
      manufacturedAt: new Date(),
      expiresAt:      new Date(Date.now() + 365 * 86400000),
    },
  });
  testBatchId = batch.id;

  // Enqueue 3 test events for this batch
  await ledgerService.enqueueEvent('BATCH_CREATED', testBatchId, {
    batchId:        testBatchId,
    batchNumber:    batch.batchNumber,
    productId:      prodId,
    manufacturerId: orgId,
    quantity:       1000,
  });

  await ledgerService.enqueueEvent('CUSTODY_TRANSFERRED', testBatchId, {
    batchId:    testBatchId,
    transferId: `rec-xfer-${TS}`,
    receiverId: orgId,
    quantity:   500,
  });

  await ledgerService.enqueueEvent('RECALL_INITIATED', testBatchId, {
    batchId:        testBatchId,
    reason:         'Test emergency recall order',
    initiatedByOrg: orgId,
  });
});

afterAll(async () => {
  if (testBatchId) {
    await prisma.outboxEvent.deleteMany({ where: { aggregateId: testBatchId } });
    await prisma.ledgerTransaction.deleteMany({ where: { batchId: testBatchId } });
    await prisma.batch.deleteMany({ where: { id: testBatchId } });
  }
  if (prodId) await prisma.product.deleteMany({ where: { id: prodId } });
  if (orgId)  await prisma.organization.deleteMany({ where: { id: orgId } });
  await prisma.$disconnect();
});

describe('Ledger Outbox Reconciler Worker', () => {
  it('processes pending outbox events and records confirmed Fabric ledger transactions', async () => {
    // 1. Verify events start in pending state (processedAt is null)
    const initialPending = await prisma.outboxEvent.findMany({
      where: { aggregateId: testBatchId, processedAt: null },
    });
    expect(initialPending.length).toBe(3);

    // 2. Trigger reconciliation pass
    const { processed, failed } = await reconcileOnce();
    expect(processed).toBeGreaterThanOrEqual(3);
    expect(failed).toBe(0);

    // 3. Verify outbox events are marked as processed
    const remainingPending = await prisma.outboxEvent.findMany({
      where: { aggregateId: testBatchId, processedAt: null },
    });
    expect(remainingPending.length).toBe(0);

    // 4. Verify LedgerTransaction rows were confirmed with fabricTxId
    const confirmedTxs = await prisma.ledgerTransaction.findMany({
      where: { batchId: testBatchId, status: 'CONFIRMED' },
    });
    expect(confirmedTxs.length).toBe(3);
    expect(confirmedTxs.every((tx) => tx.fabricTxId && tx.fabricTxId.length === 64)).toBe(true);
  });
});
