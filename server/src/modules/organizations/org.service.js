// src/modules/organizations/org.service.js

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';

export async function createOrganization(data) {
  return prisma.organization.create({ data });
}

export async function listOrganizations({ type, page = 1, pageSize = 20 } = {}) {
  const where = {};
  if (type) where.type = type;

  const [orgs, total] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
    }),
    prisma.organization.count({ where }),
  ]);

  return { orgs, total, page, pageSize };
}

export async function getOrganization(id) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: { users: { select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true } } },
  });
  if (!org) throw new NotFoundError('Organization');
  return org;
}

export async function updateOrganizationStatus(id, status) {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new NotFoundError('Organization');
  return prisma.organization.update({ where: { id }, data: { status } });
}
