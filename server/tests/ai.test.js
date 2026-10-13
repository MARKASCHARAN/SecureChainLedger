// tests/ai.test.js
// Integration tests for server AI Intelligence and Provenance Scoring

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../src/lib/prisma.js';
import app from '../src/app.js';

let orgId, productId, batchId;
const batchNumber = `AI-TEST-BATCH-${Date.now()}`;
const docHash = 'sha256-hash-for-ai-test-verification';

beforeAll(async () => {
  const org = await prisma.organization.create({
    data: {
      name: `AI Test Pharma ${Date.now()}`,
      type: 'MANUFACTURER',
      status: 'ACTIVE',
      country: 'India',
    },
  });
  orgId = org.id;

  const product = await prisma.product.create({
    data: {
      genericName: 'AI Test Molecule',
      brandName: 'AITranq',
      formulation: 'Tablet',
      strength: '50mg',
      manufacturerId: orgId,
    },
  });
  productId = product.id;

  const batch = await prisma.batch.create({
    data: {
      batchNumber,
      productId,
      manufacturerId: orgId,
      currentOwnerId: orgId,
      quantity: 5000,
      unitPrice: 25.5,
      status: 'APPROVED',
      qaDocumentHash: docHash,
      qaApprovedAt: new Date(),
      manufacturedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year ahead
    },
  });
  batchId = batch.id;
});

afterAll(async () => {
  if (batchId) {
    await prisma.verificationLog.deleteMany({ where: { batchId } });
    await prisma.batch.deleteMany({ where: { id: batchId } });
  }
  if (productId) {
    await prisma.product.deleteMany({ where: { id: productId } });
  }
  if (orgId) {
    await prisma.organization.deleteMany({ where: { id: orgId } });
  }
  await prisma.$disconnect();
});

describe('AI Intelligence & Provenance Risk Scoring API', () => {
  it('returns comprehensive AI analysis for a valid batch', async () => {
    const res = await request(app).get(`/api/v1/ai/batches/${batchNumber}/analyze`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.batchNumber).toBe(batchNumber);
    expect(res.body.data.isAiGenerated).toBe(true);
    expect(typeof res.body.data.provenanceScore).toBe('number');
    expect(res.body.data.provenanceScore).toBeGreaterThanOrEqual(80);
    expect(res.body.data.riskLevel).toBe('LOW');
    expect(res.body.data.ratingLabel).toBe('VERIFIED_SECURE');
    expect(Array.isArray(res.body.data.anomalies)).toBe(true);
    expect(res.body.data.auditSummary).toBeDefined();
    expect(res.body.data.auditSummary.recommendation).toContain('Safe for standard distribution');
  });

  it('returns 404 for non-existent batch', async () => {
    const res = await request(app).get('/api/v1/ai/batches/NON-EXISTENT-AI-BATCH/analyze');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('includes aiIntelligence in public verification response', async () => {
    const res = await request(app).get(`/api/v1/verification/${batchNumber}`);

    expect(res.status).toBe(200);
    expect(res.body.data.aiIntelligence).toBeDefined();
    expect(res.body.data.aiIntelligence.provenanceScore).toBeGreaterThanOrEqual(80);
    expect(res.body.data.aiIntelligence.riskLevel).toBe('LOW');
  });
});
