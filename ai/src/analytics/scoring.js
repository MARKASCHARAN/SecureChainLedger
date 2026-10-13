// ai/src/analytics/scoring.js
// Provenance trust score calculation and NLP audit insights.

/**
 * Computes an objective 0-100 provenance integrity score for a batch.
 */
export function calculateProvenanceScore(batch = {}, transfers = [], anomalies = []) {
  let score = 0;
  const deductions = [];
  const bonuses = [];

  // 1. Manufacturer Accreditation (15 pts)
  if (batch.manufacturer?.status === 'ACTIVE' || batch.manufacturerId) {
    score += 15;
    bonuses.push('Licensed pharmaceutical manufacturer origin (+15)');
  } else {
    deductions.push('Unverified manufacturing entity');
  }

  // 2. QA Cryptographic Certificate (15 pts)
  if (batch.qaDocumentHash) {
    score += 15;
    bonuses.push('Cryptographic QA certificate hash anchored on ledger (+15)');
  } else {
    score += 5; // Partial for basic QA sign-off
    deductions.push('Missing off-chain QA document hash digest (-10)');
  }

  // 3. Custody Chain Continuity (25 pts)
  if (transfers.length > 0) {
    const hasRejections = transfers.some((t) => t.status === 'REJECTED');
    if (!hasRejections) {
      score += 25;
      bonuses.push('Unbroken custody sequence across supply chain nodes (+25)');
    } else {
      score += 10;
      deductions.push('Custody rejections recorded along transit route (-15)');
    }
  } else {
    // If newly manufactured batch at facility, full baseline
    score += 25;
    bonuses.push('Origin stock at primary certified facility (+25)');
  }

  // 4. Custody Delivery Confirmation (15 pts)
  const deliveredTransfers = transfers.filter((t) => t.status === 'DELIVERED');
  if (transfers.length === 0 || deliveredTransfers.length > 0) {
    score += 15;
    bonuses.push('Confirmed cryptographic receipt handshakes (+15)');
  } else {
    score += 5;
    deductions.push('Unconfirmed in-transit custody state (-10)');
  }

  // 5. Expiration & Shelf Life Safety (15 pts)
  const now = new Date();
  if (batch.expiresAt && new Date(batch.expiresAt) > now) {
    score += 15;
    bonuses.push('Valid unexpired pharmaceutical shelf-life (+15)');
  } else if (batch.expiresAt) {
    deductions.push('Product has surpassed registered expiration date (-15)');
  } else {
    score += 10;
  }

  // 6. Recall Status (15 pts)
  if (batch.status === 'RECALLED') {
    score = Math.min(score, 20); // Severe cap
    deductions.push('CRITICAL: Batch has been flagged under active drug recall (-80)');
  } else {
    score += 15;
    bonuses.push('No active recalls recorded across health networks (+15)');
  }

  // Penalize for detected anomalies
  for (const anomaly of anomalies) {
    if (anomaly.severity === 'CRITICAL') {
      score = Math.max(0, score - 35);
      deductions.push(`Critical anomaly detected: ${anomaly.type} (-35)`);
    } else if (anomaly.severity === 'HIGH') {
      score = Math.max(0, score - 20);
      deductions.push(`High-severity anomaly: ${anomaly.type} (-20)`);
    } else {
      score = Math.max(0, score - 10);
      deductions.push(`Moderate anomaly: ${anomaly.type} (-10)`);
    }
  }

  // Clamp 0 to 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let riskLevel = 'LOW';
  let ratingLabel = 'VERIFIED_SECURE';

  if (finalScore >= 85) {
    riskLevel = 'LOW';
    ratingLabel = 'VERIFIED_SECURE';
  } else if (finalScore >= 70) {
    riskLevel = 'MODERATE';
    ratingLabel = 'STANDARD_COMPLIANCE';
  } else if (finalScore >= 45) {
    riskLevel = 'HIGH';
    ratingLabel = 'ELEVATED_RISK';
  } else {
    riskLevel = 'CRITICAL';
    ratingLabel = 'COMPROMISED_RISK';
  }

  return {
    provenanceScore: finalScore,
    riskLevel,
    ratingLabel,
    bonuses,
    deductions,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Produces structured natural language compliance summary from audit data.
 */
export function generateAuditSummary(batch = {}, scoreResult = {}, anomalies = []) {
  const lines = [];

  lines.push(`Executive Provenance Analysis for Batch ${batch.batchNumber || 'N/A'}:`);
  lines.push(`Overall Trust Score: ${scoreResult.provenanceScore}/100 (${scoreResult.ratingLabel}).`);

  if (anomalies.length === 0) {
    lines.push('No suspicious transport patterns or duplicate verification signals detected.');
  } else {
    lines.push(`Identified ${anomalies.length} potential supply-chain anomaly signals requiring investigation:`);
    anomalies.forEach((a, idx) => {
      lines.push(`  ${idx + 1}. [${a.severity}] ${a.message}`);
    });
  }

  lines.push(`Lifecycle status is currently '${batch.status || 'UNKNOWN'}'.`);

  return {
    summaryText: lines.join('\n'),
    keyFindings: anomalies.map((a) => a.message),
    recommendation:
      scoreResult.riskLevel === 'LOW'
        ? 'Batch exhibits continuous chain-of-custody integrity. Safe for standard distribution.'
        : scoreResult.riskLevel === 'MODERATE'
        ? 'Minor custody gaps noted. Review transport temperature logs before dispensing.'
        : 'Immediate regulatory quarantine recommended. Significant provenance discrepancy detected.',
  };
}
