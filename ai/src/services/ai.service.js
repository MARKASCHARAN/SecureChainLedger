// ai/src/services/ai.service.js
import { detectTransferAnomalies, detectVerificationAnomalies } from '../anomaly-detection/detector.js';
import { calculateProvenanceScore, generateAuditSummary } from '../analytics/scoring.js';

export function analyzeBatch(data = {}) {
  const { batch = {}, transfers = [], verificationLogs = [] } = data;

  // 1. Detect logistics and verification anomalies
  const transferAnomalies = detectTransferAnomalies(transfers, batch);
  const scanAnomalies = detectVerificationAnomalies(verificationLogs);
  const allAnomalies = [...transferAnomalies, ...scanAnomalies];

  // 2. Compute provenance score
  const scoreResult = calculateProvenanceScore(batch, transfers, allAnomalies);

  // 3. Generate natural language audit summary
  const auditSummary = generateAuditSummary(batch, scoreResult, allAnomalies);

  return {
    batchNumber: batch.batchNumber,
    isAiGenerated: true,
    disclaimer: 'AI-generated intelligence for decision support. Authoritative provenance is anchored on the Hyperledger Fabric ledger.',
    provenanceScore: scoreResult.provenanceScore,
    riskLevel: scoreResult.riskLevel,
    ratingLabel: scoreResult.ratingLabel,
    anomalies: allAnomalies,
    scoreBreakdown: {
      bonuses: scoreResult.bonuses,
      deductions: scoreResult.deductions,
    },
    auditSummary,
    analyzedAt: new Date().toISOString(),
  };
}
