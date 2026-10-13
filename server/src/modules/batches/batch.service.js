// src/modules/batches/batch.service.js
// Business logic for pharmaceutical batch management.

import { prisma } from '../../lib/prisma.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../lib/errors.js';
import { ledgerService } from '../ledger/ledger.service.js';

/**
 * Creates a new batch record.
 * Only MANUFACTURER role users can create batches for their own organization.
 */
export async function createBatch(data, requestingUser) {
  const { batchNumber, productId, quantity, unitPrice, manufacturedAt, expiresAt, storageConditions, qaDocumentHash } = data;

  // Verify the product belongs to the manufacturer's org
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError('Product');
  if (product.manufacturerId !== requestingUser.organizationId) {
    throw new ForbiddenError('You can only create batches for products in your organization.');
  }

  // Check for duplicate batch number
  const existing = await prisma.batch.findUnique({ where: { batchNumber } });
  if (existing) throw new ConflictError(`Batch number '${batchNumber}' already exists.`);

  const batch = await prisma.batch.create({
    data: {
      batchNumber,
      productId,
      manufacturerId: requestingUser.organizationId,
      currentOwnerId: requestingUser.organizationId,
      quantity,
      unitPrice,
      manufacturedAt,
      expiresAt,
      storageConditions,
      qaDocumentHash,
      status: 'DRAFT',
    },
    include: { product: true, manufacturer: { select: { id: true, name: true } } },
  });

  // Enqueue a ledger event — remains PENDING until Fabric confirms
  await ledgerService.enqueueEvent('BATCH_CREATED', batch.id, {
    batchNumber: batch.batchNumber,
    productId: batch.productId,
    manufacturerId: batch.manufacturerId,
    quantity: batch.quantity,
    manufacturedAt: batch.manufacturedAt,
    expiresAt: batch.expiresAt,
  });

  return batch;
}

/**
 * Retrieves batches visible to the requesting user.
 * Manufacturers see their own. Regulators and Admins see all.
 */
export async function listBatches({ status, page, pageSize }, requestingUser) {
  const exemptRoles = ['REGULATOR', 'ADMIN'];
  const where = {};

  if (!exemptRoles.includes(requestingUser.role)) {
    where.manufacturerId = requestingUser.organizationId;
  }
  if (status) where.status = status;

  const [batches, total] = await prisma.$transaction([
    prisma.batch.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { product: true, manufacturer: { select: { id: true, name: true } } },
    }),
    prisma.batch.count({ where }),
  ]);

  return { batches, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Gets a single batch by ID. Enforces org-level visibility.
 */
export async function getBatch(batchId, requestingUser) {
  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      product: true,
      manufacturer: { select: { id: true, name: true } },
      transfers: { orderBy: { createdAt: 'desc' }, take: 10 },
      ledgerTxs: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  });

  if (!batch) throw new NotFoundError('Batch');

  const exemptRoles = ['REGULATOR', 'ADMIN'];
  if (!exemptRoles.includes(requestingUser.role) && batch.manufacturerId !== requestingUser.organizationId) {
    throw new ForbiddenError('Access to this batch is denied.');
  }

  return batch;
}

/**
 * Approves a batch for distribution (QA sign-off).
 * Only MANUFACTURER role within the owning org.
 */
export async function approveBatch(batchId, requestingUser) {
  const batch = await prisma.batch.findUnique({ where: { id: batchId } });
  if (!batch) throw new NotFoundError('Batch');

  if (batch.manufacturerId !== requestingUser.organizationId) {
    throw new ForbiddenError('Only the manufacturing organization can approve this batch.');
  }

  if (batch.status !== 'PENDING_QA') {
    throw new ConflictError(`Batch must be in PENDING_QA status to approve. Current: ${batch.status}`);
  }

  const updated = await prisma.batch.update({
    where: { id: batchId },
    data: { status: 'APPROVED', qaApprovedAt: new Date(), qaApprovedBy: requestingUser.id },
  });

  await ledgerService.enqueueEvent('BATCH_APPROVED', batchId, {
    batchId,
    approvedBy: requestingUser.id,
    approvedAt: updated.qaApprovedAt,
  });

  return updated;
}
