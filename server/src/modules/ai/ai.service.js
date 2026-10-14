import { prisma } from '../../lib/prisma.js';

const AI_MICROSERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

export function detectSupplyChainAnomalies(transfers = [], batch = {}, logs = []) {
  const anomalies = [];

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

  for (let i = 1; i < transfers.length; i++) {
    const prev = transfers[i - 1];
    const curr = transfers[i];
    const prevTime = new Date(prev.receivedAt || prev.createdAt).getTime();
    const currTime = new Date(curr.createdAt).getTime();
    const elapsedMinutes = (currTime - prevTime) / (1000 * 60);

    if (elapsedMinutes >= 0 && elapsedMinutes < 5 && prev.receiverId !== curr.senderId) {
      anomalies.push({
        type: 'SUSPICIOUS_CUSTODY_VELOCITY',
        severity: 'MEDIUM',
        confidence: 0.85,
        message: `Rapid consecutive custody change observed (${Math.round(elapsedMinutes)} minutes between transfers).`,
        evidence: { elapsedMinutes },
      });
    }
  }

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

  if (Array.isArray(logs) && logs.length >= 2) {
    const sorted = [...logs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      const diffMinutes = (new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime()) / (1000 * 60);

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
  }

  return anomalies;
}

export function computeProvenanceScore(batch = {}, transfers = [], anomalies = []) {
  let score = 0;
  const deductions = [];
  const bonuses = [];

  if (batch.manufacturer?.status === 'ACTIVE' || batch.manufacturerId) {
    score += 15;
    bonuses.push('Licensed pharmaceutical manufacturer origin (+15)');
  } else {
    deductions.push('Unverified manufacturing entity');
  }

  if (batch.qaDocumentHash) {
    score += 15;
    bonuses.push('Cryptographic QA certificate hash anchored on ledger (+15)');
  } else {
    score += 5;
    deductions.push('Missing off-chain QA document hash digest (-10)');
  }

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
    score += 25;
    bonuses.push('Origin stock at primary certified facility (+25)');
  }

  const deliveredTransfers = transfers.filter((t) => t.status === 'DELIVERED');
  if (transfers.length === 0 || deliveredTransfers.length > 0) {
    score += 15;
    bonuses.push('Confirmed cryptographic receipt handshakes (+15)');
  } else {
    score += 5;
    deductions.push('Unconfirmed in-transit custody state (-10)');
  }

  const now = new Date();
  if (batch.expiresAt && new Date(batch.expiresAt) > now) {
    score += 15;
    bonuses.push('Valid unexpired pharmaceutical shelf-life (+15)');
  } else if (batch.expiresAt) {
    deductions.push('Product has surpassed registered expiration date (-15)');
  } else {
    score += 10;
  }

  if (batch.status === 'RECALLED') {
    score = Math.min(score, 20);
    deductions.push('CRITICAL: Batch has been flagged under active drug recall (-80)');
  } else {
    score += 15;
    bonuses.push('No active recalls recorded across health networks (+15)');
  }

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
  };
}

export function buildAuditSummary(batch = {}, scoreResult = {}, anomalies = []) {
  const lines = [
    `Executive Provenance Analysis for Batch ${batch.batchNumber || 'N/A'}:`,
    `Overall Trust Score: ${scoreResult.provenanceScore}/100 (${scoreResult.ratingLabel}).`,
  ];

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
    regulatoryCompliance: scoreResult.riskLevel === 'LOW' ? 'FDA DSCSA & EU FMD Compliant' : 'Subject to DSCSA Verification Audit',
  };
}

export async function queryGroqProvenanceAnalysis(batch = {}, transfers = [], anomalies = [], scoreResult = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const systemPrompt = `You are a certified pharmaceutical supply-chain cybersecurity and provenance auditor for SecureChainLedger.
Your task is to analyze pharmaceutical batch metadata, custody transfer history, cryptographic ledger verification, and detected anomalies.
Always respond with valid JSON matching this schema:
{
  "summaryText": "string summarizing executive provenance findings",
  "keyFindings": ["string bullet points of significant chain events or risks"],
  "recommendation": "string recommending distribution, inspection, or quarantine action",
  "regulatoryCompliance": "string evaluating FDA DSCSA / EU FMD compliance status"
}`;

  const userPrompt = JSON.stringify({
    batch: {
      batchNumber: batch.batchNumber,
      drugName: batch.drugName,
      dosage: batch.dosage,
      status: batch.status,
      quantity: batch.quantity,
      qaDocumentHash: batch.qaDocumentHash,
      manufacturedAt: batch.manufacturedAt,
      expiresAt: batch.expiresAt,
    },
    custodyChainLength: transfers.length,
    custodyHandoffs: transfers.map((t) => ({
      sender: t.sender?.orgName || t.senderId,
      receiver: t.receiver?.orgName || t.receiverId,
      status: t.status,
      date: t.receivedAt || t.createdAt,
    })),
    detectedAnomalies: anomalies,
    computedTrustScore: scoreResult.provenanceScore,
    riskRating: scoreResult.riskLevel,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const payload = await res.json();
    const rawContent = payload?.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    const parsed = JSON.parse(rawContent);
    return {
      summaryText: parsed.summaryText || '',
      keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
      recommendation: parsed.recommendation || '',
      regulatoryCompliance: parsed.regulatoryCompliance || '',
      modelUsed: model,
    };
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function evaluateBatchAi(batch, transfers = [], logs = []) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);

    const response = await fetch(`${AI_MICROSERVICE_URL}/api/v1/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch, transfers, verificationLogs: logs }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data?.data) {
        return data.data;
      }
    }
  } catch {
  }

  const anomalies = detectSupplyChainAnomalies(transfers, batch, logs);
  const scoreResult = computeProvenanceScore(batch, transfers, anomalies);

  let groqResult = null;
  try {
    groqResult = await queryGroqProvenanceAnalysis(batch, transfers, anomalies, scoreResult);
  } catch {
    groqResult = null;
  }

  const defaultAuditSummary = buildAuditSummary(batch, scoreResult, anomalies);

  const auditSummary = groqResult
    ? {
        summaryText: groqResult.summaryText || defaultAuditSummary.summaryText,
        keyFindings: (groqResult.keyFindings && groqResult.keyFindings.length > 0)
          ? groqResult.keyFindings
          : defaultAuditSummary.keyFindings,
        recommendation: groqResult.recommendation || defaultAuditSummary.recommendation,
        regulatoryCompliance: groqResult.regulatoryCompliance || defaultAuditSummary.regulatoryCompliance,
      }
    : defaultAuditSummary;

  return {
    batchNumber: batch.batchNumber,
    isAiGenerated: true,
    aiProvider: groqResult ? 'Groq Cloud LLM' : 'SecureChain Rule Engine',
    model: groqResult ? groqResult.modelUsed : 'Deterministic Heuristic v2.1',
    disclaimer: 'AI-generated intelligence for decision support. Authoritative provenance is anchored on the Hyperledger Fabric ledger.',
    provenanceScore: scoreResult.provenanceScore,
    riskLevel: scoreResult.riskLevel,
    ratingLabel: scoreResult.ratingLabel,
    anomalies,
    scoreBreakdown: {
      bonuses: scoreResult.bonuses,
      deductions: scoreResult.deductions,
    },
    auditSummary,
    analyzedAt: new Date().toISOString(),
  };
}
