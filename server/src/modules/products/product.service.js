// src/modules/products/product.service.js

import { prisma } from '../../lib/prisma.js';
import { ForbiddenError, NotFoundError } from '../../lib/errors.js';

/**
 * Creates a product. Only the manufacturer's own org.
 */
export async function createProduct(data, requestingUser) {
  return prisma.product.create({
    data: { ...data, manufacturerId: requestingUser.organizationId },
    include: { manufacturer: { select: { id: true, name: true } } },
  });
}

/**
 * Lists products. Manufacturers see their own; Regulators/Admins see all.
 */
export async function listProducts({ genericName, formulation, page, pageSize }, requestingUser) {
  const exemptRoles = ['REGULATOR', 'ADMIN'];
  const where = {};

  if (!exemptRoles.includes(requestingUser.role)) {
    where.manufacturerId = requestingUser.organizationId;
  }
  if (genericName) where.genericName = { contains: genericName, mode: 'insensitive' };
  if (formulation) where.formulation = formulation;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { genericName: 'asc' },
      include: { manufacturer: { select: { id: true, name: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

/**
 * Gets a single product. All authenticated users can read any product (for
 * batch lookup / transfer flows). Manufacturers are restricted to their own.
 */
export async function getProduct(id, requestingUser) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      manufacturer: { select: { id: true, name: true } },
      batches: {
        select: { id: true, batchNumber: true, status: true, quantity: true, expiresAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) throw new NotFoundError('Product');

  const exemptRoles = ['REGULATOR', 'ADMIN', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY'];
  if (!exemptRoles.includes(requestingUser.role) &&
      product.manufacturerId !== requestingUser.organizationId) {
    throw new ForbiddenError('Access to this product is denied.');
  }

  return product;
}

/**
 * Updates a product. Only the owning manufacturer.
 */
export async function updateProduct(id, data, requestingUser) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError('Product');

  if (product.manufacturerId !== requestingUser.organizationId) {
    throw new ForbiddenError('Only the manufacturing organization can update this product.');
  }

  return prisma.product.update({
    where: { id },
    data,
    include: { manufacturer: { select: { id: true, name: true } } },
  });
}
