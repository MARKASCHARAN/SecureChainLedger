// tests/workflow.test.js
// Integration tests for the complete Phase 3 vertical workflow:
// Manufacturer Batch -> Distribution -> Public Verification -> Recall & Quarantine

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../src/lib/prisma.js';
import app from '../src/app.js';

let mfrToken, distToken;
let mfrOrgId, distOrgId;
let productId, batchId;
const batchNumber = `WF-BATCH-${Date.now()}`;
const docHash = 'sha256-qa-cert-workflow-test-hash-12345';
const TS = Date.now();

beforeAll(async () => {
  // 1. Create Manufacturer & Distributor
  const mfrOrg = await prisma.organization.create({
    data: { name: `Workflow Mfr ${TS}`, type: 'MANUFACTURER', status: 'ACTIVE', city: 'Mumbai', country: 'India' },
  });
  mfrOrgId = mfrOrg.id;

  const distOrg = await prisma.organization.create({
    data: { name: `Workflow Dist ${TS}`, type: 'DISTRIBUTOR', status: 'ACTIVE', city: 'Delhi', country: 'India' },
  });
  distOrgId = distOrg.id;

  await request(app).post('/api/v1/auth/register').send({
    email:          `wf-mfr-${TS}@test.invalid`,
    password:       'Workflow@1234',
    firstName:      'Wf',
    lastName:       'Mfr',
    role:           'MANUFACTURER',
    organizationId: mfrOrgId,
  });

  const mfrLogin = await request(app).post('/api/v1/auth/login').send({
    email:    `wf-mfr-${TS}@test.invalid`,
    password: 'Workflow@1234',
  });
  mfrToken = mfrLogin.body.data.accessToken;

  await request(app).post('/api/v1/auth/register').send({
    email:          `wf-dist-${TS}@test.invalid`,
    password:       'Workflow@1234',
    firstName:      'Wf',
    lastName:       'Dist',
    role:           'DISTRIBUTOR',
    organizationId: distOrgId,
  });

  const distLogin = await request(app).post('/api/v1/auth/login').send({
    email:    `wf-dist-${TS}@test.invalid`,
    password: 'Workflow@1234',
  });
  distToken = distLogin.body.data.accessToken;

  // 2. Create Product
  const prodRes = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${mfrToken}`)
    .send({
      genericName:   `Workflow Drug ${TS}`,
      brandName:     `WfDrug-${TS}`,
      formulation:   'Tablet',
      strength:      '500mg',
      scheduledDrug: false,
    });
  productId = prodRes.body.data.product.id;

  // 3. Create Batch with QA document hash
  const batchRes = await request(app)
    .post('/api/v1/batches')
    .set('Authorization', `Bearer ${mfrToken}`)
    .send({
      batchNumber,
      productId,
      quantity:       2000,
      unitPrice:      50,
      manufacturedAt: new Date(Date.now() - 86400000).toISOString(),
      expiresAt:      new Date(Date.now() + 365 * 86400000).toISOString(),
      qaDocumentHash: docHash,
    });
  batchId = batchRes.body.data.batch.id;

  // Move to PENDING_QA then Approve
  await prisma.batch.update({
    where: { id: batchId },
    data:  { status: 'PENDING_QA' },
  });

  await request(app)
    .patch(`/api/v1/batches/${batchId}/approve`)
    .set('Authorization', `Bearer ${mfrToken}`)
    .send();

  // 4. Transfer 800 units to Distributor and confirm receipt
  const xferRes = await request(app)
    .post('/api/v1/transfers')
    .set('Authorization', `Bearer ${mfrToken}`)
    .send({
      batchId,
      receiverId: distOrgId,
      quantity:   800,
      notes:      'Dispatch to regional hub',
    });
  const transferId = xferRes.body.data.transfer.id;

  await request(app)
    .post(`/api/v1/transfers/${transferId}/confirm`)
    .set('Authorization', `Bearer ${distToken}`)
    .send({ notes: 'Received and quarantined in hub cold room' });
});

afterAll(async () => {
  const orgIds = [mfrOrgId, distOrgId].filter(Boolean);
  const emails = [`wf-mfr-${TS}@test.invalid`, `wf-dist-${TS}@test.invalid`];

  if (orgIds.length > 0) {
    await prisma.verificationLog.deleteMany({ where: { batchId } });
    await prisma.recallBatch.deleteMany({ where: { batchId } });
    await prisma.recall.deleteMany({ where: { initiatorId: { in: orgIds } } });
    await prisma.outboxEvent.deleteMany({ where: { aggregateId: batchId } });
    await prisma.transfer.deleteMany({
      where: { OR: [{ senderId: { in: orgIds } }, { receiverId: { in: orgIds } }] },
    });
    await prisma.inventory.deleteMany({ where: { organizationId: { in: orgIds } } });
    await prisma.batch.deleteMany({ where: { manufacturerId: { in: orgIds } } });
    await prisma.product.deleteMany({ where: { manufacturerId: { in: orgIds } } });
    await prisma.refreshSession.deleteMany({ where: { user: { email: { in: emails } } } });
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
    await prisma.organization.deleteMany({ where: { id: { in: orgIds } } });
  }
  await prisma.$disconnect();
});

describe('Phase 3 Vertical Slice: Verification, Inventory & Recalls', () => {
  let createdRecallId;

  describe('Inventory API', () => {
    it('returns inventory balance for manufacturer and distributor', async () => {
      const mfrInvRes = await request(app)
        .get('/api/v1/inventory')
        .set('Authorization', `Bearer ${mfrToken}`);

      expect(mfrInvRes.status).toBe(200);
      const mfrItem = mfrInvRes.body.data.inventory.find((i) => i.batchId === batchId);
      expect(mfrItem).toBeTruthy();
      expect(mfrItem.quantity).toBe(1200); // 2000 - 800
      expect(mfrItem.availableQty).toBe(1200);

      const distInvRes = await request(app)
        .get(`/api/v1/inventory/${batchId}`)
        .set('Authorization', `Bearer ${distToken}`);

      expect(distInvRes.status).toBe(200);
      expect(distInvRes.body.data.inventory.quantity).toBe(800);
      expect(distInvRes.body.data.inventory.availableQty).toBe(800);
    });
  });

  describe('Public Verification API', () => {
    it('publicly verifies batch without authentication (consumer scan)', async () => {
      const res = await request(app).get(`/api/v1/verification/${batchNumber}`);

      expect(res.status).toBe(200);
      expect(res.body.data.batchNumber).toBe(batchNumber);
      expect(res.body.data.verificationStatus).toBe('AUTHENTIC');
      expect(res.body.data.product.genericName).toBe(`Workflow Drug ${TS}`);
      expect(res.body.data.manufacturer.name).toBe(`Workflow Mfr ${TS}`);
      expect(res.body.data.hasQaDocument).toBe(true);
      expect(res.body.data.provenanceTrail.length).toBeGreaterThanOrEqual(2);

      // Verify verification log was created
      const logs = await prisma.verificationLog.findMany({ where: { batchId } });
      expect(logs.length).toBeGreaterThanOrEqual(1);
      expect(logs[0].result).toBe('AUTHENTIC');
    });

    it('verifies QA document hash match', async () => {
      const res = await request(app).post('/api/v1/verification/verify-hash').send({
        batchNumber,
        documentHash: docHash,
      });

      expect(res.status).toBe(200);
      expect(res.body.data.isMatch).toBe(true);

      const mismatchRes = await request(app).post('/api/v1/verification/verify-hash').send({
        batchNumber,
        documentHash: 'sha256-invalid-corrupted-hash',
      });

      expect(mismatchRes.status).toBe(200);
      expect(mismatchRes.body.data.isMatch).toBe(false);
    });
  });

  describe('Recalls Workflow', () => {
    it('manufacturer initiates recall on batch', async () => {
      const res = await request(app)
        .post('/api/v1/recalls')
        .set('Authorization', `Bearer ${mfrToken}`)
        .send({
          reason:      'Packaging seal integrity compromised in distribution',
          description: 'Immediate quarantine required for all remaining units.',
          batchIds:    [batchId],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.recall.status).toBe('INITIATED');
      createdRecallId = res.body.data.recall.id;

      // Verify batch status updated to RECALLED
      const batch = await prisma.batch.findUnique({ where: { id: batchId } });
      expect(batch.status).toBe('RECALLED');

      // Verify ledger outbox event enqueued
      const outbox = await prisma.outboxEvent.findFirst({
        where: { aggregateId: batchId, eventType: 'RECALL_INITIATED' },
      });
      expect(outbox).toBeTruthy();
    });

    it('public verification immediately reports RECALLED status with consumer warning', async () => {
      const res = await request(app).get(`/api/v1/verification/${batchNumber}`);

      expect(res.status).toBe(200);
      expect(res.body.data.verificationStatus).toBe('RECALLED');
      expect(res.body.data.message).toMatch(/warning: this batch has been officially recalled/i);
    });

    it('downstream distributor acknowledges recall and confirms quarantine', async () => {
      const res = await request(app)
        .post(`/api/v1/recalls/${createdRecallId}/acknowledge`)
        .set('Authorization', `Bearer ${distToken}`)
        .send({
          batchId,
          notes: 'Quarantined all 800 units in designated biohazard cage.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.acknowledged.acknowledgedAt).toBeTruthy();

      // Verify RECALL_ACKNOWLEDGED ledger event
      const ackOutbox = await prisma.outboxEvent.findFirst({
        where: { aggregateId: batchId, eventType: 'RECALL_ACKNOWLEDGED' },
      });
      expect(ackOutbox).toBeTruthy();
    });

    it('lists recalls with initiator details', async () => {
      const res = await request(app)
        .get('/api/v1/recalls')
        .set('Authorization', `Bearer ${mfrToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.recalls.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.recalls[0].affectedBatches.length).toBeGreaterThanOrEqual(1);
    });
  });
});
