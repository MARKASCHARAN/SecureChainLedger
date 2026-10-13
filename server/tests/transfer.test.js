// tests/transfer.test.js
// Integration tests for the custody transfer lifecycle:
// Manufacturer -> Distributor transfer initiation, rejection, and confirmation.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../src/lib/prisma.js';
import app from '../src/app.js';

let mfrToken, distToken, hospToken;
let mfrOrgId, distOrgId, hospOrgId;
let productId, batchId;

const TS = Date.now();

beforeAll(async () => {
  // 1. Create Manufacturer org & user
  const mfrOrg = await prisma.organization.create({
    data: { name: `Mfr Transfer Org ${TS}`, type: 'MANUFACTURER', status: 'ACTIVE' },
  });
  mfrOrgId = mfrOrg.id;

  await request(app).post('/api/v1/auth/register').send({
    email:          `mfr-${TS}@test.invalid`,
    password:       'Transfer@1234',
    firstName:      'Mfr',
    lastName:       'Admin',
    role:           'MANUFACTURER',
    organizationId: mfrOrgId,
  });

  const mfrLogin = await request(app).post('/api/v1/auth/login').send({
    email:    `mfr-${TS}@test.invalid`,
    password: 'Transfer@1234',
  });
  mfrToken = mfrLogin.body.data.accessToken;

  // 2. Create Distributor org & user
  const distOrg = await prisma.organization.create({
    data: { name: `Dist Transfer Org ${TS}`, type: 'DISTRIBUTOR', status: 'ACTIVE' },
  });
  distOrgId = distOrg.id;

  await request(app).post('/api/v1/auth/register').send({
    email:          `dist-${TS}@test.invalid`,
    password:       'Transfer@1234',
    firstName:      'Dist',
    lastName:       'Admin',
    role:           'DISTRIBUTOR',
    organizationId: distOrgId,
  });

  const distLogin = await request(app).post('/api/v1/auth/login').send({
    email:    `dist-${TS}@test.invalid`,
    password: 'Transfer@1234',
  });
  distToken = distLogin.body.data.accessToken;

  // 3. Create Hospital org & user
  const hospOrg = await prisma.organization.create({
    data: { name: `Hosp Transfer Org ${TS}`, type: 'HOSPITAL', status: 'ACTIVE' },
  });
  hospOrgId = hospOrg.id;

  await request(app).post('/api/v1/auth/register').send({
    email:          `hosp-${TS}@test.invalid`,
    password:       'Transfer@1234',
    firstName:      'Hosp',
    lastName:       'Admin',
    role:           'HOSPITAL',
    organizationId: hospOrgId,
  });

  const hospLogin = await request(app).post('/api/v1/auth/login').send({
    email:    `hosp-${TS}@test.invalid`,
    password: 'Transfer@1234',
  });
  hospToken = hospLogin.body.data.accessToken;

  // 4. Create Product
  const prodRes = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${mfrToken}`)
    .send({
      genericName:   `Transfer Medicine ${TS}`,
      brandName:     `TxMed-${TS}`,
      formulation:   'Tablet',
      strength:      '500mg',
      scheduledDrug: false,
    });
  productId = prodRes.body.data.product.id;

  // 5. Create Batch
  const batchRes = await request(app)
    .post('/api/v1/batches')
    .set('Authorization', `Bearer ${mfrToken}`)
    .send({
      batchNumber:    `TX-BATCH-${TS}`,
      productId,
      quantity:       1000,
      unitPrice:      25.5,
      manufacturedAt: new Date(Date.now() - 86400000).toISOString(),
      expiresAt:      new Date(Date.now() + 365 * 86400000).toISOString(),
    });
  batchId = batchRes.body.data.batch.id;

  // Move batch to PENDING_QA then approve
  await prisma.batch.update({
    where: { id: batchId },
    data:  { status: 'PENDING_QA' },
  });

  const approveRes = await request(app)
    .patch(`/api/v1/batches/${batchId}/approve`)
    .set('Authorization', `Bearer ${mfrToken}`)
    .send();

  expect(approveRes.status).toBe(200);
});

afterAll(async () => {
  const orgIds = [mfrOrgId, distOrgId, hospOrgId].filter(Boolean);
  const emails = [`mfr-${TS}@test.invalid`, `dist-${TS}@test.invalid`, `hosp-${TS}@test.invalid`];

  if (orgIds.length > 0) {
    await prisma.outboxEvent.deleteMany({ where: { aggregateId: batchId } });
    await prisma.ledgerTransaction.deleteMany({ where: { batchId } });
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

describe('Transfer Lifecycle', () => {
  let transferIdToReject;
  let transferIdToConfirm;

  it('rejects transfer when requested quantity exceeds inventory', async () => {
    const res = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${mfrToken}`)
      .send({
        batchId,
        receiverId: distOrgId,
        quantity:   2000, // available is only 1000
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/Insufficient inventory/i);
  });

  it('rejects transfer to own organization', async () => {
    const res = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${mfrToken}`)
      .send({
        batchId,
        receiverId: mfrOrgId,
        quantity:   100,
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/Cannot transfer to your own organization/i);
  });

  it('rejects transfer initiated by non-owner', async () => {
    const res = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${distToken}`)
      .send({
        batchId,
        receiverId: hospOrgId,
        quantity:   50,
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Only the current owner/i);
  });

  it('initiates transfer and reserves inventory', async () => {
    const res = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${mfrToken}`)
      .send({
        batchId,
        receiverId: distOrgId,
        quantity:   200,
        notes:      'Test shipment 1',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.transfer.status).toBe('INITIATED');
    expect(res.body.data.transfer.quantity).toBe(200);
    transferIdToReject = res.body.data.transfer.id;

    // Check inventory reservation
    const inv = await prisma.inventory.findUnique({
      where: { organizationId_batchId: { organizationId: mfrOrgId, batchId } },
    });
    expect(inv.quantity).toBe(1000);
    expect(inv.reservedQty).toBe(200);

    // Check outbox ledger event
    const outboxEvt = await prisma.outboxEvent.findFirst({
      where: { aggregateId: batchId, eventType: 'CUSTODY_TRANSFERRED' },
    });
    expect(outboxEvt).toBeTruthy();
  });

  it('receiver rejects transfer, releasing reserved inventory and reverting status', async () => {
    // Attempting to reject as non-receiver should be forbidden
    const forbiddenRes = await request(app)
      .post(`/api/v1/transfers/${transferIdToReject}/reject`)
      .set('Authorization', `Bearer ${mfrToken}`)
      .send({ reason: 'Accidental rejection attempt' });

    expect(forbiddenRes.status).toBe(403);

    // Proper receiver rejects
    const res = await request(app)
      .post(`/api/v1/transfers/${transferIdToReject}/reject`)
      .set('Authorization', `Bearer ${distToken}`)
      .send({ reason: 'Packaging damaged on inspection' });

    expect(res.status).toBe(200);
    expect(res.body.data.transfer.status).toBe('REJECTED');

    // Verify inventory reservation was released
    const inv = await prisma.inventory.findUnique({
      where: { organizationId_batchId: { organizationId: mfrOrgId, batchId } },
    });
    expect(inv.quantity).toBe(1000);
    expect(inv.reservedQty).toBe(0);

    // Verify batch reverted to APPROVED
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    expect(batch.status).toBe('APPROVED');
  });

  it('initiates and confirms delivery with custody transfer', async () => {
    // 1. Mfr initiates transfer of 400 units
    const initRes = await request(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${mfrToken}`)
      .send({
        batchId,
        receiverId: distOrgId,
        quantity:   400,
        notes:      'Official distributor dispatch',
      });

    expect(initRes.status).toBe(201);
    transferIdToConfirm = initRes.body.data.transfer.id;

    // 2. Distributor confirms receipt
    const confirmRes = await request(app)
      .post(`/api/v1/transfers/${transferIdToConfirm}/confirm`)
      .set('Authorization', `Bearer ${distToken}`)
      .send({ notes: 'Accepted all 400 intact units' });

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.transfer.status).toBe('DELIVERED');

    // 3. Verify Sender (Mfr) Inventory: decremented from 1000 to 600, reservedQty back to 0
    const mfrInv = await prisma.inventory.findUnique({
      where: { organizationId_batchId: { organizationId: mfrOrgId, batchId } },
    });
    expect(mfrInv.quantity).toBe(600);
    expect(mfrInv.reservedQty).toBe(0);

    // 4. Verify Receiver (Dist) Inventory: created with 400 units
    const distInv = await prisma.inventory.findUnique({
      where: { organizationId_batchId: { organizationId: distOrgId, batchId } },
    });
    expect(distInv.quantity).toBe(400);

    // 5. Verify batch currentOwnerId updated to Distributor
    const updatedBatch = await prisma.batch.findUnique({ where: { id: batchId } });
    expect(updatedBatch.currentOwnerId).toBe(distOrgId);
    expect(updatedBatch.status).toBe('DELIVERED');

    // 6. Verify RECEIPT_CONFIRMED ledger event enqueued
    const receiptTx = await prisma.outboxEvent.findFirst({
      where: { aggregateId: batchId, eventType: 'RECEIPT_CONFIRMED' },
    });
    expect(receiptTx).toBeTruthy();
  });

  it('lists transfers filtered by party', async () => {
    const res = await request(app)
      .get('/api/v1/transfers')
      .set('Authorization', `Bearer ${mfrToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.transfers.length).toBeGreaterThanOrEqual(2);
    expect(res.body.data.transfers.every(t => t.senderId === mfrOrgId || t.receiverId === mfrOrgId)).toBe(true);
  });
});
