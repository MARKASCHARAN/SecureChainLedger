// ai/src/anomaly-detection/detector.js
// Statistical & heuristic anomaly detection engine for pharmaceutical supply chains.

/**
 * Evaluates custody transfer events for supply chain anomalies.
 * @param {Array} transfers - Array of transfer records
 * @param {object} batch - Parent batch details (quantity, status, etc.)
 */
export function detectTransferAnomalies(transfers = [], batch = {}) {
  const anomalies = [];

  if (!Array.isArray(transfers) || transfers.length === 0) {
    return anomalies;
  }

  // 1. Check for Cumulative Quantity Leakage / Over-allocation
  const totalTransferred = transfers.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);
  if (batch.quantity && totalTransferred > batch.quantity) {
    anomalies.push({
      type: 'QUANTITY_EXCURSION',
      severity: 'HIGH',
      confidence: 0.98,
      message: `Total transferred units (${totalTransferred}) exceeds original manufactured batch quantity (${batch.quantity}). Possible counterfeit multiplication.`,
      evidence: { batchQuantity: batch.quantity, totalTransferred },
    });
  }

  // 2. Velocity / Transit Anomaly Check
  for (let i = 1; i < transfers.length; i++) {
    const prev = transfers[i - 1];
    const curr = transfers[i];

    const prevTime = new Date(prev.receivedAt || prev.createdAt).getTime();
    const currTime = new Date(curr.createdAt).getTime();
    const elapsedMinutes = (currTime - prevTime) / (1000 * 60);

    // If transfer from different entities happens in under 5 minutes
    if (elapsedMinutes >= 0 && elapsedMinutes < 5 && prev.receiverId !== curr.senderId) {
      anomalies.push({
        type: 'SUSPICIOUS_CUSTODY_VELOCITY',
        severity: 'MEDIUM',
        confidence: 0.85,
        message: `Rapid consecutive custody change observed (${Math.round(elapsedMinutes)} minutes between transfers).`,
        evidence: { transferA: prev.id, transferB: curr.id, elapsedMinutes },
      });
    }
  }

  // 3. Repeated Rejections Check
  const rejectedCount = transfers.filter((t) => t.status === 'REJECTED').length;
  if (rejectedCount >= 2) {
    anomalies.push({
      type: 'FREQUENT_CUSTODY_REJECTIONS',
      severity: 'HIGH',
      confidence: 0.92,
      message: `Batch encountered ${rejectedCount} separate rejections in transit. High risk of physical tampering or storage failure.`,
      evidence: { rejectedCount },
    });
  }

  return anomalies;
}

/**
 * Evaluates public verification scan logs for counterfeit cloning patterns.
 * @param {Array} logs - VerificationLog records
 */
export function detectVerificationAnomalies(logs = []) {
  const anomalies = [];

  if (!Array.isArray(logs) || logs.length < 2) {
    return anomalies;
  }

  // 1. Geographically Disparate Scan Burst
  const sorted = [...logs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const diffMinutes = (new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime()) / (1000 * 60);

    // If different IP addresses scan the exact same batch within 10 minutes
    if (diffMinutes >= 0 && diffMinutes <= 10 && prev.ipAddress && curr.ipAddress && prev.ipAddress !== curr.ipAddress) {
      anomalies.push({
        type: 'CONCURRENT_REMOTE_SCANS',
        severity: 'CRITICAL',
        confidence: 0.95,
        message: `Simultaneous consumer scans detected from differing remote IP addresses within ${Math.round(diffMinutes)} minutes. Probable duplicated QR code counterfeit.`,
        evidence: { ip1: prev.ipAddress, ip2: curr.ipAddress, diffMinutes },
      });
      break;
    }
  }

  // 2. Scan Frequency Surge (>10 scans in 1 hour)
  const oneHour = 60 * 60 * 1000;
  const now = Date.now();
  const recentScans = logs.filter((l) => now - new Date(l.createdAt).getTime() < oneHour);

  if (recentScans.length > 10) {
    anomalies.push({
      type: 'HIGH_FREQUENCY_SCAN_SPIKE',
      severity: 'MEDIUM',
      confidence: 0.88,
      message: `Unusual scan burst: ${recentScans.length} verification lookups recorded within the past hour.`,
      evidence: { count: recentScans.length },
    });
  }

  return anomalies;
}
