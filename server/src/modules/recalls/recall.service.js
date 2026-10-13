// src/modules/recalls/recall.service.js
import { prisma } from '../../lib/prisma.js';
import { ForbiddenError, NotFoundError, ConflictError } from '../../lib/errors.js';
import { ledgerService } from '../ledger/ledger.service.js';

/**
 * Initiates a recall for one or more batches.
 * Only REGULATOR, ADMIN, or the manufacturing organization.
 */
export async function initiateRecall({ reason, description, batchIds }, requestingUser) {
  const allowedRoles = ['REGULATOR', 'ADMIN', 'MANUFACTURER'];
  if (!allowedRoles.includes(requestingUser.role)) {
    throw new ForbiddenError('You are not authorized to initiate a drug recall.');
  }

  // Verify batches exist
  const batches = await prisma.batch.findMany({
    where: { id: { in: batchIds } },
  });

  if (batches.length !== batchIds.length) {
    throw new NotFoundError('One or more specified batches could not be found.');
  }

  // If manufacturer, ensure they produced all batches
  if (requestingUser.role === 'MANUFACTURER') {
    const unauthorized = batches.some((b) => b.manufacturerId !== requestingUser.organizationId);
    if (unauthorized) {
      throw new ForbiddenError('Manufacturers can only recall batches manufactured by their organization.');
    }
  }

  // Create recall and mark batches as RECALLED in a transaction
  const recall = await prisma.$transaction(async (tx) => {
    const createdRecall = await tx.recall.create({
      data: {
        reason,
        description,
        status:      'INITIATED',
        initiatorId: requestingUser.organizationId,
        affectedBatches: {
          create: batchIds.map((batchId) => ({ batchId })),
        },
      },
      include: {
        initiator: { select: { id: true, name: true, type: true } },
        affectedBatches: { include: { batch: { include: { product: true } } } },
      },
    });

    // Update status of all affected batches to RECALLED
    await tx.batch.updateMany({
      where: { id: { in: batchIds } },
      data:  { status: 'RECALLED' },
    });

    return createdRecall;
  });

  // Enqueue ledger events for each batch
  for (const batch of batches) {
    await ledgerService.enqueueEvent('RECALL_INITIATED', batch.id, {
      recallId: recall.id,
      batchId:  batch.id,
      batchNumber: batch.batchNumber,
      reason,
      initiatedByOrg: requestingUser.organizationId,
    });
  }

  return recall;
}

/**
 * A downstream supply chain holder acknowledges a recall and confirms quarantine.
 */
export async function acknowledgeRecall(recallId, { batchId, notes }, requestingUser) {
  const recallBatch = await prisma.recallBatch.findUnique({
    where: { recallId_batchId: { recallId, batchId } },
    include: { batch: true, recall: true },
  });

  if (!recallBatch) {
    throw new NotFoundError('Recall batch relationship not found.');
  }

  if (recallBatch.acknowledgedAt) {
    throw new ConflictError('This batch recall has already been acknowledged.');
  }

  const updated = await prisma.recallBatch.update({
    where: { recallId_batchId: { recallId, batchId } },
    data: {
      acknowledgedAt: new Date(),
      acknowledgedBy: requestingUser.id,
    },
    include: { batch: true },
  });

  await ledgerService.enqueueEvent('RECALL_ACKNOWLEDGED', batchId, {
    recallId,
    batchId,
    holderOrg:   requestingUser.organizationId,
    acknowledgedBy: requestingUser.id,
    notes:       notes || '',
  });

  return updated;
}

/**
 * Lists recalls with pagination.
 */
export async function listRecalls({ status, page, pageSize }) {
  const where = {};
  if (status) where.status = status;

  const [recalls, total] = await prisma.$transaction([
    prisma.recall.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        initiator: { select: { id: true, name: true, type: true } },
        affectedBatches: {
          include: {
            batch: { select: { id: true, batchNumber: true, product: { select: { genericName: true } } } },
          },
        },
      },
    }),
    prisma.recall.count({ where }),
  ]);

  return { recalls, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Gets details of a specific recall.
 */
export async function getRecall(recallId) {
  const recall = await prisma.recall.findUnique({
    where: { id: recallId },
    include: {
      initiator: { select: { id: true, name: true, type: true } },
      affectedBatches: {
        include: {
          batch: {
            include: {
              product: true,
              manufacturer: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!recall) throw new NotFoundError('Recall');
  return recall;
}
