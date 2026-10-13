// src/modules/transfers/transfer.service.js
// Custody transfer business logic.
// A transfer moves a quantity of a batch from one org to another.
// Both the PostgreSQL row and a ledger outbox event are written atomically.

import { prisma } from '../../lib/prisma.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../lib/errors.js';
import { ledgerService } from '../ledger/ledger.service.js';

/**
 * Initiates a transfer from the requesting user's org to a receiver org.
 * Checks:
 *   - Batch exists and is in APPROVED or IN_TRANSIT state
 *   - Sender is the current owner of the batch
 *   - Sufficient inventory exists
 *   - Receiver org exists
 */
export async function initiateTransfer({ batchId, receiverId, quantity, notes }, requestingUser) {
  const batch = await prisma.batch.findUnique({ where: { id: batchId } });
  if (!batch) throw new NotFoundError('Batch');

  if (!['APPROVED', 'IN_TRANSIT'].includes(batch.status)) {
    throw new ConflictError(`Batch status '${batch.status}' is not eligible for transfer.`);
  }

  if (batch.currentOwnerId !== requestingUser.organizationId) {
    throw new ForbiddenError('Only the current owner of this batch can initiate a transfer.');
  }

  // Verify sufficient inventory
  const inv = await prisma.inventory.findUnique({
    where: { organizationId_batchId: { organizationId: requestingUser.organizationId, batchId } },
  });

  const available = inv ? inv.quantity - inv.reservedQty : 0;
  if (available < quantity) {
    throw new ConflictError(`Insufficient inventory. Available: ${available}, Requested: ${quantity}`);
  }

  const receiver = await prisma.organization.findUnique({ where: { id: receiverId } });
  if (!receiver) throw new NotFoundError('Receiver organization');
  if (receiver.id === requestingUser.organizationId) {
    throw new ConflictError('Cannot transfer to your own organization.');
  }

  // Atomic: create transfer + reserve inventory
  const [transfer] = await prisma.$transaction([
    prisma.transfer.create({
      data: {
        batchId,
        senderId:      requestingUser.organizationId,
        receiverId,
        quantity,
        notes,
        status:        'INITIATED',
        ledgerTxStatus:'PENDING',
      },
      include: {
        batch:    { select: { id: true, batchNumber: true } },
        sender:   { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    }),
    // Reserve the quantity so it can't be double-transferred
    prisma.inventory.update({
      where: { organizationId_batchId: { organizationId: requestingUser.organizationId, batchId } },
      data:  { reservedQty: { increment: quantity } },
    }),
    // Move batch to IN_TRANSIT
    prisma.batch.update({
      where: { id: batchId },
      data:  { status: 'IN_TRANSIT' },
    }),
  ]);

  await ledgerService.enqueueEvent('CUSTODY_TRANSFERRED', batchId, {
    transferId:  transfer.id,
    batchId,
    senderId:    requestingUser.organizationId,
    receiverId,
    quantity,
    initiatedAt: transfer.createdAt,
  });

  return transfer;
}

/**
 * Receiver confirms delivery of a transfer.
 * Updates inventory for both orgs and marks batch owner.
 */
export async function confirmReceipt(transferId, requestingUser, { notes } = {}) {
  const transfer = await prisma.transfer.findUnique({
    where: { id: transferId },
    include: { batch: true },
  });

  if (!transfer) throw new NotFoundError('Transfer');
  if (transfer.receiverId !== requestingUser.organizationId) {
    throw new ForbiddenError('Only the receiving organization can confirm this transfer.');
  }
  if (transfer.status !== 'INITIATED' && transfer.status !== 'IN_TRANSIT') {
    throw new ConflictError(`Transfer cannot be confirmed in status '${transfer.status}'.`);
  }

  await prisma.$transaction([
    // Mark delivered
    prisma.transfer.update({
      where: { id: transferId },
      data:  { status: 'DELIVERED', receivedAt: new Date(), notes: notes || transfer.notes },
    }),
    // Deduct from sender inventory (also releases reservation)
    prisma.inventory.update({
      where: { organizationId_batchId: { organizationId: transfer.senderId, batchId: transfer.batchId } },
      data:  { quantity: { decrement: transfer.quantity }, reservedQty: { decrement: transfer.quantity } },
    }),
    // Add to receiver inventory (upsert — receiver may have existing stock)
    prisma.inventory.upsert({
      where: { organizationId_batchId: { organizationId: transfer.receiverId, batchId: transfer.batchId } },
      update:{ quantity: { increment: transfer.quantity } },
      create:{ organizationId: transfer.receiverId, batchId: transfer.batchId, quantity: transfer.quantity },
    }),
    // Update batch ownership
    prisma.batch.update({
      where: { id: transfer.batchId },
      data:  { currentOwnerId: transfer.receiverId, status: 'DELIVERED' },
    }),
  ]);

  await ledgerService.enqueueEvent('RECEIPT_CONFIRMED', transfer.batchId, {
    transferId,
    receiverId:    requestingUser.organizationId,
    confirmedAt:   new Date(),
    quantity:      transfer.quantity,
  });

  return prisma.transfer.findUnique({
    where: { id: transferId },
    include: {
      batch:    { select: { id: true, batchNumber: true } },
      sender:   { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });
}

/**
 * Receiver rejects an incoming transfer.
 * Releases reservation, reverts batch status to APPROVED.
 */
export async function rejectTransfer(transferId, requestingUser, reason) {
  const transfer = await prisma.transfer.findUnique({ where: { id: transferId } });
  if (!transfer) throw new NotFoundError('Transfer');
  if (transfer.receiverId !== requestingUser.organizationId) {
    throw new ForbiddenError('Only the receiving organization can reject this transfer.');
  }
  if (!['INITIATED', 'IN_TRANSIT'].includes(transfer.status)) {
    throw new ConflictError(`Transfer cannot be rejected in status '${transfer.status}'.`);
  }

  await prisma.$transaction([
    prisma.transfer.update({
      where: { id: transferId },
      data:  { status: 'REJECTED', notes: reason },
    }),
    // Release the reservation
    prisma.inventory.update({
      where: { organizationId_batchId: { organizationId: transfer.senderId, batchId: transfer.batchId } },
      data:  { reservedQty: { decrement: transfer.quantity } },
    }),
    // Revert batch to APPROVED so another transfer can be initiated
    prisma.batch.update({
      where: { id: transfer.batchId },
      data:  { status: 'APPROVED' },
    }),
  ]);

  return prisma.transfer.findUnique({ where: { id: transferId } });
}

/**
 * Lists transfers visible to the requesting user.
 */
export async function listTransfers({ status, role, page, pageSize }, requestingUser) {
  const exemptRoles = ['REGULATOR', 'ADMIN'];
  const where = {};

  if (!exemptRoles.includes(requestingUser.role)) {
    const orgId = requestingUser.organizationId;
    if (role === 'sender')        where.senderId   = orgId;
    else if (role === 'receiver') where.receiverId = orgId;
    else                          where.OR = [{ senderId: orgId }, { receiverId: orgId }];
  }

  if (status) where.status = status;

  const [transfers, total] = await prisma.$transaction([
    prisma.transfer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        batch:    { select: { id: true, batchNumber: true, product: { select: { genericName: true } } } },
        sender:   { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    }),
    prisma.transfer.count({ where }),
  ]);

  return { transfers, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Gets a single transfer.
 */
export async function getTransfer(transferId, requestingUser) {
  const transfer = await prisma.transfer.findUnique({
    where: { id: transferId },
    include: {
      batch:    { include: { product: true } },
      sender:   true,
      receiver: true,
    },
  });

  if (!transfer) throw new NotFoundError('Transfer');

  const exemptRoles = ['REGULATOR', 'ADMIN'];
  if (!exemptRoles.includes(requestingUser.role)) {
    const orgId = requestingUser.organizationId;
    if (transfer.senderId !== orgId && transfer.receiverId !== orgId) {
      throw new ForbiddenError('Access to this transfer is denied.');
    }
  }

  return transfer;
}
