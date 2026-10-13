// ai/src/routes/ai.routes.js
import { Router } from 'express';
import { analyzeBatch } from '../services/ai.service.js';
import { detectTransferAnomalies, detectVerificationAnomalies } from '../anomaly-detection/detector.js';
import { calculateProvenanceScore } from '../analytics/scoring.js';

const router = Router();

router.post('/analyze', (req, res) => {
  try {
    const analysis = analyzeBatch(req.body);
    return res.json({ success: true, data: analysis });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/score', (req, res) => {
  try {
    const { batch, transfers, anomalies } = req.body;
    const score = calculateProvenanceScore(batch, transfers, anomalies);
    return res.json({ success: true, data: score });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/detect-anomalies', (req, res) => {
  try {
    const { transfers, batch, verificationLogs } = req.body;
    const transferAnomalies = detectTransferAnomalies(transfers, batch);
    const scanAnomalies = detectVerificationAnomalies(verificationLogs);
    return res.json({
      success: true,
      data: {
        anomalies: [...transferAnomalies, ...scanAnomalies],
        count: transferAnomalies.length + scanAnomalies.length,
      },
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
