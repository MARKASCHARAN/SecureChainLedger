// ai/test/ai.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { detectTransferAnomalies, detectVerificationAnomalies } from '../src/anomaly-detection/detector.js';
import { calculateProvenanceScore } from '../src/analytics/scoring.js';

describe('AI Intelligence & Anomaly Detection', () => {
  describe('Transfer Anomaly Detection', () => {
    it('flags quantity excursion when transferred amount exceeds batch quantity', () => {
      const batch = { quantity: 1000 };
      const transfers = [
        { id: 't1', quantity: 700, status: 'DELIVERED' },
        { id: 't2', quantity: 600, status: 'DELIVERED' }, // 1300 > 1000
      ];

      const anomalies = detectTransferAnomalies(transfers, batch);
      expect(anomalies).toHaveLength(1);
      expect(anomalies[0].type).toBe('QUANTITY_EXCURSION');
      expect(anomalies[0].severity).toBe('HIGH');
    });

    it('flags suspicious custody velocity when rapid handovers occur across entities', () => {
      const batch = { quantity: 500 };
      const baseTime = Date.now();
      const transfers = [
        { id: 't1', quantity: 200, senderId: 'org1', receiverId: 'org2', createdAt: new Date(baseTime).toISOString(), receivedAt: new Date(baseTime + 60000).toISOString() },
        { id: 't2', quantity: 200, senderId: 'org3', receiverId: 'org4', createdAt: new Date(baseTime + 120000).toISOString() }, // 1 min later
      ];

      const anomalies = detectTransferAnomalies(transfers, batch);
      expect(anomalies.some((a) => a.type === 'SUSPICIOUS_CUSTODY_VELOCITY')).toBe(true);
    });

    it('flags frequent transit rejections', () => {
      const batch = { quantity: 1000 };
      const transfers = [
        { id: 't1', quantity: 100, status: 'REJECTED' },
        { id: 't2', quantity: 100, status: 'REJECTED' },
      ];

      const anomalies = detectTransferAnomalies(transfers, batch);
      expect(anomalies.some((a) => a.type === 'FREQUENT_CUSTODY_REJECTIONS')).toBe(true);
    });
  });

  describe('Verification Anomaly Detection', () => {
    it('detects concurrent scans from differing remote IP addresses (counterfeit QR clone)', () => {
      const now = Date.now();
      const logs = [
        { id: 'v1', ipAddress: '103.21.244.2', createdAt: new Date(now).toISOString() },
        { id: 'v2', ipAddress: '49.207.180.5', createdAt: new Date(now + 3 * 60000).toISOString() }, // 3 mins later from different IP
      ];

      const anomalies = detectVerificationAnomalies(logs);
      expect(anomalies).toHaveLength(1);
      expect(anomalies[0].type).toBe('CONCURRENT_REMOTE_SCANS');
      expect(anomalies[0].severity).toBe('CRITICAL');
    });

    it('returns empty array when scans are normal', () => {
      const logs = [
        { id: 'v1', ipAddress: '103.21.244.2', createdAt: new Date().toISOString() },
      ];
      expect(detectVerificationAnomalies(logs)).toHaveLength(0);
    });
  });

  describe('Provenance Scoring Engine', () => {
    it('computes high trust score for verified compliant batch', () => {
      const batch = {
        manufacturerId: 'mfr-1',
        manufacturer: { status: 'ACTIVE' },
        qaDocumentHash: 'sha256-cert-valid-12345',
        status: 'DELIVERED',
        expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(),
      };
      const transfers = [
        { id: 't1', status: 'DELIVERED' },
      ];

      const result = calculateProvenanceScore(batch, transfers, []);
      expect(result.provenanceScore).toBeGreaterThanOrEqual(90);
      expect(result.riskLevel).toBe('LOW');
      expect(result.ratingLabel).toBe('VERIFIED_SECURE');
    });

    it('severely penalizes recalled batch', () => {
      const batch = {
        manufacturerId: 'mfr-1',
        status: 'RECALLED',
      };

      const result = calculateProvenanceScore(batch, [], []);
      expect(result.provenanceScore).toBeLessThanOrEqual(20);
      expect(result.riskLevel).toBe('CRITICAL');
    });
  });

  describe('AI REST API Endpoints', () => {
    it('GET /health returns 200', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.service).toBe('securechain-ai');
    });

    it('POST /api/v1/ai/analyze returns complete intelligence report with disclaimer', async () => {
      const payload = {
        batch: {
          batchNumber: 'AI-TEST-BATCH-001',
          quantity: 1000,
          status: 'APPROVED',
          qaDocumentHash: 'sha256-cert-999',
          expiresAt: new Date(Date.now() + 300 * 86400000).toISOString(),
        },
        transfers: [
          { id: 'x1', quantity: 500, status: 'DELIVERED' },
        ],
      };

      const res = await request(app).post('/api/v1/ai/analyze').send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isAiGenerated).toBe(true);
      expect(res.body.data.disclaimer).toMatch(/hyperledger fabric/i);
      expect(res.body.data.provenanceScore).toBeGreaterThanOrEqual(80);
      expect(res.body.data.auditSummary.summaryText).toContain('AI-TEST-BATCH-001');
    });

    it('POST /api/v1/ai/detect-anomalies finds injected anomalies', async () => {
      const res = await request(app).post('/api/v1/ai/detect-anomalies').send({
        batch: { quantity: 500 },
        transfers: [
          { quantity: 400, status: 'DELIVERED' },
          { quantity: 300, status: 'DELIVERED' }, // 700 > 500
        ],
      });

      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(1);
      expect(res.body.data.anomalies[0].type).toBe('QUANTITY_EXCURSION');
    });
  });
});
