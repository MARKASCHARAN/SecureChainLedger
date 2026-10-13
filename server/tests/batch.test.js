// tests/batch.test.js
// Integration tests for the full manufacturer batch creation + approval workflow.
// Requires a running DB (securechain_test) with migrations applied.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../src/lib/prisma.js';
import app from '../src/app.js';

let accessToken;
let orgId;
let productId;
let batchId;

const TS = Date.now();

beforeAll(async () => {
  // Create org + user for test isolation
  const org = await prisma.organization.create({
    data: { name: `Batch Test Org ${TS}`, type: 'MANUFACTURER', status: 'ACTIVE' },
  });
  orgId = org.id;

  await request(app).post('/api/v1/auth/register').send({
    email:          `batch-test-${TS}@test.invalid`,
    password:       'BatchTest@1234',
    firstName:      'Batch',
    lastName:       'Tester',
    role:           'MANUFACTURER',
    organizationId: orgId,
  });

  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email:    `batch-test-${TS}@test.invalid`,
    password: 'BatchTest@1234',
  });
  accessToken = loginRes.body.data.accessToken;

  // Create a product for this org
  const pRes = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      genericName:   'Test Drug',
      brandName:     `TDrug-${TS}`,
      formulation:   'Tablet',
      strength:      '100mg',
      scheduledDrug: false,
    });
  productId = pRes.body.data.product.id;
});

afterAll(async () => {
  if (orgId) {
    await prisma.inventory.deleteMany({ where: { organizationId: orgId } });
    await prisma.batch.deleteMany({ where: { manufacturerId: orgId } });
    await prisma.product.deleteMany({ where: { manufacturerId: orgId } });
    await prisma.refreshSession.deleteMany({ where: { user: { email: `batch-test-${TS}@test.invalid` } } });
    await prisma.user.deleteMany({ where: { email: `batch-test-${TS}@test.invalid` } });
    await prisma.organization.deleteMany({ where: { id: orgId } });
  }
  await prisma.$disconnect();
});

describe('Products API', () => {
  it('creates a product as MANUFACTURER', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        genericName:   'Another Drug',
        brandName:     `ADrug-${TS}`,
        formulation:   'Capsule',
        strength:      '250mg',
        scheduledDrug: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.product.manufacturerId).toBe(orgId);
  });

  it('rejects invalid formulation', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ genericName: 'X', brandName: 'Y', formulation: 'GelCap', strength: '10mg' });

    expect(res.status).toBe(422);
  });

  it('lists products belonging to own org', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.products.every(p => p.manufacturerId === orgId)).toBe(true);
  });
});

describe('Batch lifecycle', () => {
  it('creates a batch in DRAFT status', async () => {
    const res = await request(app)
      .post('/api/v1/batches')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        batchNumber:    `BATCH-TEST-${TS}`,
        productId,
        quantity:       1000,
        unitPrice:      12.50,
        manufacturedAt: '2026-01-01T00:00:00Z',
        expiresAt:      '2028-01-01T00:00:00Z',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.batch.status).toBe('DRAFT');
    batchId = res.body.data.batch.id;
  });

  it('rejects duplicate batch number', async () => {
    const res = await request(app)
      .post('/api/v1/batches')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        batchNumber:    `BATCH-TEST-${TS}`,
        productId,
        quantity:       500,
        unitPrice:      10.00,
        manufacturedAt: '2026-01-01T00:00:00Z',
        expiresAt:      '2028-01-01T00:00:00Z',
      });

    expect(res.status).toBe(409);
  });

  it('cannot approve a DRAFT batch (must be PENDING_QA)', async () => {
    const res = await request(app)
      .patch(`/api/v1/batches/${batchId}/approve`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(409);
  });

  it('moves batch to PENDING_QA then approves it', async () => {
    // Manually set to PENDING_QA via DB (simulates internal QA submission)
    await prisma.batch.update({ where: { id: batchId }, data: { status: 'PENDING_QA' } });

    const res = await request(app)
      .patch(`/api/v1/batches/${batchId}/approve`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.batch.status).toBe('APPROVED');
  });

  it('retrieves the batch and confirms ledger event was enqueued', async () => {
    const res = await request(app)
      .get(`/api/v1/batches/${batchId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    // Verify outbox event was written for this batch
    const outbox = await prisma.outboxEvent.findMany({
      where: { aggregateId: batchId },
    });
    expect(outbox.length).toBeGreaterThanOrEqual(1);
    expect(outbox[0].processedAt).toBeNull(); // PENDING, not yet confirmed
  });
});
