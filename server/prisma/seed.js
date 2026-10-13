// prisma/seed.js
// Development seed — clearly fake data only. Never run against production.
// Run: npm run db:seed

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import argon2 from 'argon2';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱  Seeding development database with FAKE data...');

  // ── Organisations ─────────────────────────────────────────────────────────
  const manufacturer = await prisma.organization.upsert({
    where:  { name: 'DEMO Pharma Pvt Ltd' },
    update: {},
    create: {
      name: 'DEMO Pharma Pvt Ltd',
      type: 'MANUFACTURER',
      status: 'ACTIVE',
      licenseNo: 'DEMO-MFR-001',
      city: 'Mumbai',
      state: 'Maharashtra',
      contactName: 'Demo MFR Admin',
      contactEmail: 'mfr@demo.invalid',
      fabricMspId: 'Org1MSP',
    },
  });

  const distributor = await prisma.organization.upsert({
    where:  { name: 'DEMO Distrib Co' },
    update: {},
    create: {
      name: 'DEMO Distrib Co',
      type: 'DISTRIBUTOR',
      status: 'ACTIVE',
      licenseNo: 'DEMO-DIST-001',
      city: 'Delhi',
      state: 'Delhi',
      contactName: 'Demo Dist Admin',
      contactEmail: 'dist@demo.invalid',
      fabricMspId: 'Org2MSP',
    },
  });

  const regulator = await prisma.organization.upsert({
    where:  { name: 'DEMO CDSCO' },
    update: {},
    create: {
      name: 'DEMO CDSCO',
      type: 'REGULATOR',
      status: 'ACTIVE',
      city: 'New Delhi',
      state: 'Delhi',
      contactName: 'Demo Regulator',
      contactEmail: 'regulator@demo.invalid',
    },
  });

  // ── Users ─────────────────────────────────────────────────────────────────
  const pw = await argon2.hash('Dev@1234!', { type: argon2.argon2id });

  await prisma.user.upsert({
    where:  { email: 'mfr.admin@demo.invalid' },
    update: {},
    create: {
      email:          'mfr.admin@demo.invalid',
      passwordHash:   pw,
      firstName:      'Demo',
      lastName:       'Manufacturer',
      role:           'MANUFACTURER',
      organizationId: manufacturer.id,
    },
  });

  await prisma.user.upsert({
    where:  { email: 'dist.admin@demo.invalid' },
    update: {},
    create: {
      email:          'dist.admin@demo.invalid',
      passwordHash:   pw,
      firstName:      'Demo',
      lastName:       'Distributor',
      role:           'DISTRIBUTOR',
      organizationId: distributor.id,
    },
  });

  await prisma.user.upsert({
    where:  { email: 'regulator@demo.invalid' },
    update: {},
    create: {
      email:          'regulator@demo.invalid',
      passwordHash:   pw,
      firstName:      'Demo',
      lastName:       'Regulator',
      role:           'REGULATOR',
      organizationId: regulator.id,
    },
  });

  // ── Product ───────────────────────────────────────────────────────────────
  const product = await prisma.product.upsert({
    where:  { id: 'demo-product-paracetamol-001' },
    update: {},
    create: {
      id:             'demo-product-paracetamol-001',
      genericName:    'Paracetamol',
      brandName:      'DEMO-PARA-500',
      formulation:    'Tablet',
      strength:       '500mg',
      manufacturerId: manufacturer.id,
    },
  });

  // ── Demo Batch ─────────────────────────────────────────────────────────────
  const batch = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-001' },
    update: {},
    create: {
      batchNumber: 'BATCH-2026-001',
      productId: product.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: manufacturer.id,
      quantity: 5000,
      unitPrice: 12.50,
      status: 'APPROVED',
      qaDocumentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qaApprovedAt: new Date(),
      manufacturedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years
      storageConditions: 'Controlled room temperature (15°C to 25°C), protect from light',
    },
  });

  await prisma.inventory.upsert({
    where: {
      organizationId_batchId: {
        organizationId: manufacturer.id,
        batchId: batch.id,
      },
    },
    update: {},
    create: {
      organizationId: manufacturer.id,
      batchId: batch.id,
      quantity: 5000,
      reservedQty: 0,
    },
  });

  console.log('✅  Seed complete!');
  console.log('');
  console.log('   Demo credentials (FAKE — development only):');
  console.log('   mfr.admin@demo.invalid  / Dev@1234!');
  console.log('   dist.admin@demo.invalid / Dev@1234!');
  console.log('   regulator@demo.invalid  / Dev@1234!');
  console.log('');
  console.log('   Demo batch:         BATCH-2026-001');
  console.log('   Manufacturer org ID:', manufacturer.id);
  console.log('   Demo product ID:    ', product.id);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
