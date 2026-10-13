// src/modules/inventory/inventory.service.js
import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';

/**
 * Lists inventory items owned by the requesting user's organization.
 * Regulators and Admins can view all inventory.
 */
export async function listInventory({ page, pageSize }, requestingUser) {
  const exemptRoles = ['REGULATOR', 'ADMIN'];
  const where = {};

  if (!exemptRoles.includes(requestingUser.role)) {
    where.organizationId = requestingUser.organizationId;
  }

  const [items, total] = await prisma.$transaction([
    prisma.inventory.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      include: {
        organization: { select: { id: true, name: true, type: true } },
        batch: {
          select: {
            id: true,
            batchNumber: true,
            status: true,
            expiresAt: true,
            storageConditions: true,
            product: {
              select: {
                id: true,
                genericName: true,
                brandName: true,
                formulation: true,
                strength: true,
              },
            },
          },
        },
      },
    }),
    prisma.inventory.count({ where }),
  ]);

  const mapped = items.map((item) => ({
    ...item,
    availableQty: Math.max(0, item.quantity - item.reservedQty),
  }));

  return { inventory: mapped, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Gets inventory details for a specific batch within the user's organization.
 */
export async function getInventoryByBatch(batchId, requestingUser) {
  const exemptRoles = ['REGULATOR', 'ADMIN'];
  const where = { batchId };

  if (!exemptRoles.includes(requestingUser.role)) {
    where.organizationId = requestingUser.organizationId;
  }

  const item = await prisma.inventory.findFirst({
    where,
    include: {
      organization: { select: { id: true, name: true, type: true } },
      batch: {
        include: {
          product: true,
          manufacturer: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!item) {
    throw new NotFoundError('Inventory record for this batch not found in your organization.');
  }

  return {
    ...item,
    availableQty: Math.max(0, item.quantity - item.reservedQty),
  };
}
