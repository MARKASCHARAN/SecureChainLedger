// src/modules/verification/verification.service.js
// Public & authenticated pharmaceutical batch verification service.

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import { evaluateBatchAi } from '../ai/ai.service.js';

/**
 * Publicly verifies a batch by its human-readable batch number.
 * Can be called anonymously by consumers or by authenticated actors.
 * Logs verification attempt to VerificationLog.
 */
export async function verifyBatch(batchNumber, { ipAddress, userAgent, requestingUser } = {}) {
  const batch = await prisma.batch.findUnique({
    where: { batchNumber },
    include: {
      product: {
        select: {
          id: true,
          brandName: true,
          genericName: true,
          formulation: true,
          strength: true,
          scheduledDrug: true,
        },
      },
      manufacturer: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
          status: true,
        },
      },
      transfers: {
        where: { status: 'DELIVERED' },
        orderBy: { receivedAt: 'asc' },
        select: {
          id: true,
          quantity: true,
          shippedAt: true,
          receivedAt: true,
          sender: { select: { id: true, name: true, type: true } },
          receiver: { select: { id: true, name: true, type: true } },
        },
      },
    },
  });

  if (!batch) {
    throw new NotFoundError(`Batch '${batchNumber}' not found.`);
  }

  // Determine verification result
  let result = 'AUTHENTIC';
  let message = 'Batch is authentic and certified for distribution.';
  const now = new Date();

  if (batch.status === 'RECALLED') {
    result = 'RECALLED';
    message = 'WARNING: This batch has been officially recalled. Do not distribute or consume.';
  } else if (batch.expiresAt && new Date(batch.expiresAt) < now) {
    result = 'EXPIRED';
    message = 'WARNING: This batch has passed its expiration date.';
  } else if (batch.status === 'DRAFT' || batch.status === 'PENDING_QA') {
    result = 'UNAPPROVED';
    message = 'NOTICE: This batch has not completed quality assurance sign-off.';
  }

  // Record audit log entry
  try {
    await prisma.verificationLog.create({
      data: {
        batchId:     batch.id,
        requestedBy: requestingUser ? requestingUser.id : null,
        result,
        ipAddress:   ipAddress || null,
        userAgent:   userAgent || null,
      },
    });
  } catch {
    // Non-blocking log failure
  }

  // Build custody trail
  const provenanceTrail = [
    {
      step: 1,
      actor: batch.manufacturer.name,
      role: 'MANUFACTURER',
      event: 'MANUFACTURED_AND_QA_APPROVED',
      timestamp: batch.qaApprovedAt || batch.manufacturedAt,
    },
    ...batch.transfers.map((t, idx) => ({
      step: idx + 2,
      actor: t.receiver.name,
      role: t.receiver.type,
      event: 'CUSTODY_RECEIVED',
      transferredFrom: t.sender.name,
      quantity: t.quantity,
      timestamp: t.receivedAt,
    })),
  ];

  let verificationLogs = [];
  try {
    verificationLogs = await prisma.verificationLog.findMany({
      where: { batchId: batch.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  } catch {
    // Non-blocking
  }

  const aiIntelligence = await evaluateBatchAi(batch, batch.transfers, verificationLogs);

  return {
    batchNumber:       batch.batchNumber,
    verificationStatus:result,
    message,
    product:           batch.product,
    manufacturer:      batch.manufacturer,
    manufacturedAt:    batch.manufacturedAt,
    expiresAt:         batch.expiresAt,
    qaApprovedAt:      batch.qaApprovedAt,
    storageConditions: batch.storageConditions,
    hasQaDocument:     Boolean(batch.qaDocumentHash),
    currentStatus:     batch.status,
    provenanceTrail,
    aiIntelligence,
    verifiedAt:        now.toISOString(),
  };
}

/**
 * Validates a given QA documentation hash against the registered on-chain / database hash.
 */
export async function verifyDocumentHash(batchNumber, documentHash) {
  const batch = await prisma.batch.findUnique({
    where: { batchNumber },
    select: { id: true, batchNumber: true, qaDocumentHash: true, qaApprovedAt: true },
  });

  if (!batch) {
    throw new NotFoundError(`Batch '${batchNumber}' not found.`);
  }

  const isMatch = Boolean(batch.qaDocumentHash && batch.qaDocumentHash === documentHash);

  return {
    batchNumber: batch.batchNumber,
    isMatch,
    certifiedAt: batch.qaApprovedAt,
    registeredHash: batch.qaDocumentHash ? `${batch.qaDocumentHash.slice(0, 10)}...` : null,
  };
}
