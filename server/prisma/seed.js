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
  console.log('🌱 Starting comprehensive database seed for all roles...');

  const pw = await argon2.hash('Dev@1234!', { type: argon2.argon2id });

  const manufacturer = await prisma.organization.upsert({
    where: { name: 'DEMO Pharma Pvt Ltd' },
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
    where: { name: 'DEMO Distrib Co' },
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

  const hospital = await prisma.organization.upsert({
    where: { name: 'Metro General Hospital' },
    update: {},
    create: {
      name: 'Metro General Hospital',
      type: 'HOSPITAL',
      status: 'ACTIVE',
      licenseNo: 'DEMO-HOSP-001',
      city: 'Bengaluru',
      state: 'Karnataka',
      contactName: 'Dr. S. Nair',
      contactEmail: 'hospital@demo.invalid',
      fabricMspId: 'Org3MSP',
    },
  });

  const pharmacy = await prisma.organization.upsert({
    where: { name: 'Apex Care Pharmacy' },
    update: {},
    create: {
      name: 'Apex Care Pharmacy',
      type: 'PHARMACY',
      status: 'ACTIVE',
      licenseNo: 'DEMO-PHARM-001',
      city: 'Hyderabad',
      state: 'Telangana',
      contactName: 'Chief Pharmacist',
      contactEmail: 'pharmacy@demo.invalid',
      fabricMspId: 'Org4MSP',
    },
  });

  const regulator = await prisma.organization.upsert({
    where: { name: 'DEMO CDSCO' },
    update: {},
    create: {
      name: 'DEMO CDSCO',
      type: 'REGULATOR',
      status: 'ACTIVE',
      licenseNo: 'DEMO-REG-001',
      city: 'New Delhi',
      state: 'Delhi',
      contactName: 'Central Drugs Controller',
      contactEmail: 'regulator@demo.invalid',
      fabricMspId: 'Org5MSP',
    },
  });

  await prisma.user.upsert({
    where: { email: 'mfr.admin@demo.invalid' },
    update: { passwordHash: pw, organizationId: manufacturer.id },
    create: {
      email: 'mfr.admin@demo.invalid',
      passwordHash: pw,
      firstName: 'Vikram',
      lastName: 'Mehta',
      role: 'MANUFACTURER',
      organizationId: manufacturer.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'dist.admin@demo.invalid' },
    update: { passwordHash: pw, organizationId: distributor.id },
    create: {
      email: 'dist.admin@demo.invalid',
      passwordHash: pw,
      firstName: 'Rajesh',
      lastName: 'Sharma',
      role: 'DISTRIBUTOR',
      organizationId: distributor.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'hosp.admin@demo.invalid' },
    update: { passwordHash: pw, organizationId: hospital.id },
    create: {
      email: 'hosp.admin@demo.invalid',
      passwordHash: pw,
      firstName: 'Dr. Anita',
      lastName: 'Rao',
      role: 'HOSPITAL',
      organizationId: hospital.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'pharmacy.admin@demo.invalid' },
    update: { passwordHash: pw, organizationId: pharmacy.id },
    create: {
      email: 'pharmacy.admin@demo.invalid',
      passwordHash: pw,
      firstName: 'Sunil',
      lastName: 'Verma',
      role: 'PHARMACY',
      organizationId: pharmacy.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'regulator@demo.invalid' },
    update: { passwordHash: pw, organizationId: regulator.id },
    create: {
      email: 'regulator@demo.invalid',
      passwordHash: pw,
      firstName: 'Pooja',
      lastName: 'Deshmukh',
      role: 'REGULATOR',
      organizationId: regulator.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@demo.invalid' },
    update: { passwordHash: pw, organizationId: regulator.id },
    create: {
      email: 'admin@demo.invalid',
      passwordHash: pw,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      organizationId: regulator.id,
    },
  });

  const p1 = await prisma.product.upsert({
    where: { id: 'demo-product-paracetamol-001' },
    update: {},
    create: {
      id: 'demo-product-paracetamol-001',
      genericName: 'Paracetamol',
      brandName: 'DEMO-PARA-500',
      formulation: 'Tablet',
      strength: '500mg',
      manufacturerId: manufacturer.id,
      scheduledDrug: false,
    },
  });

  const p2 = await prisma.product.upsert({
    where: { id: 'demo-product-amoxicillin-002' },
    update: {},
    create: {
      id: 'demo-product-amoxicillin-002',
      genericName: 'Amoxicillin + Potassium Clavulanate',
      brandName: 'AMOX-CLAV-625',
      formulation: 'Tablet',
      strength: '625mg',
      manufacturerId: manufacturer.id,
      scheduledDrug: false,
    },
  });

  const p3 = await prisma.product.upsert({
    where: { id: 'demo-product-remdesivir-003' },
    update: {},
    create: {
      id: 'demo-product-remdesivir-003',
      genericName: 'Remdesivir Lyophilized Powder',
      brandName: 'COVI-REM-100',
      formulation: 'Injection',
      strength: '100mg/vial',
      manufacturerId: manufacturer.id,
      scheduledDrug: true,
    },
  });

  const p4 = await prisma.product.upsert({
    where: { id: 'demo-product-insulin-004' },
    update: {},
    create: {
      id: 'demo-product-insulin-004',
      genericName: 'Recombinant Human Insulin',
      brandName: 'GLUCO-INS-100IU',
      formulation: 'Injection',
      strength: '100 IU/ml',
      manufacturerId: manufacturer.id,
      scheduledDrug: false,
    },
  });

  const p5 = await prisma.product.upsert({
    where: { id: 'demo-product-azithromycin-005' },
    update: {},
    create: {
      id: 'demo-product-azithromycin-005',
      genericName: 'Azithromycin Dihydrate',
      brandName: 'AZITHRO-FAST-500',
      formulation: 'Tablet',
      strength: '500mg',
      manufacturerId: manufacturer.id,
      scheduledDrug: false,
    },
  });

  const p6 = await prisma.product.upsert({
    where: { id: 'demo-product-morphine-006' },
    update: {},
    create: {
      id: 'demo-product-morphine-006',
      genericName: 'Morphine Sulphate',
      brandName: 'MORPH-CALM-10',
      formulation: 'Injection',
      strength: '10mg/ml',
      manufacturerId: manufacturer.id,
      scheduledDrug: true,
    },
  });

  const p7 = await prisma.product.upsert({
    where: { id: 'demo-product-vaccine-007' },
    update: {},
    create: {
      id: 'demo-product-vaccine-007',
      genericName: 'Inactivated Poliovirus Vaccine',
      brandName: 'POLIO-SHIELD-IPV',
      formulation: 'Injection',
      strength: '0.5ml single-dose',
      manufacturerId: manufacturer.id,
      scheduledDrug: false,
    },
  });

  const p8 = await prisma.product.upsert({
    where: { id: 'demo-product-cisplatin-008' },
    update: {},
    create: {
      id: 'demo-product-cisplatin-008',
      genericName: 'Cisplatin Oncology Concentrate',
      brandName: 'ONCO-CIS-50',
      formulation: 'Injection',
      strength: '50mg/50ml',
      manufacturerId: manufacturer.id,
      scheduledDrug: true,
    },
  });

  const b1 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-001' },
    update: { currentOwnerId: manufacturer.id },
    create: {
      batchNumber: 'BATCH-2026-001',
      productId: p1.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: manufacturer.id,
      quantity: 5000,
      unitPrice: 12.50,
      status: 'APPROVED',
      qaDocumentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qaApprovedAt: new Date(),
      manufacturedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 720 * 24 * 60 * 60 * 1000),
      storageConditions: 'Controlled room temperature (15°C to 25°C), protect from light',
    },
  });

  const b2 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-002' },
    update: { currentOwnerId: manufacturer.id },
    create: {
      batchNumber: 'BATCH-2026-002',
      productId: p2.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: manufacturer.id,
      quantity: 3500,
      unitPrice: 45.00,
      status: 'IN_TRANSIT',
      qaDocumentHash: 'a7c93e4149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44',
      qaApprovedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 540 * 24 * 60 * 60 * 1000),
      storageConditions: 'Store below 25°C in dry place',
    },
  });

  const b3 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-003' },
    update: { currentOwnerId: distributor.id },
    create: {
      batchNumber: 'BATCH-2026-003',
      productId: p3.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: distributor.id,
      quantity: 1200,
      unitPrice: 1800.00,
      status: 'APPROVED',
      qaDocumentHash: '8b4f2c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c442',
      qaApprovedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 360 * 24 * 60 * 60 * 1000),
      storageConditions: 'Store between 20°C to 25°C, excursion permitted up to 30°C',
    },
  });

  const b4 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-004' },
    update: { currentOwnerId: hospital.id },
    create: {
      batchNumber: 'BATCH-2026-004',
      productId: p4.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: hospital.id,
      quantity: 2500,
      unitPrice: 320.00,
      status: 'DELIVERED',
      qaDocumentHash: 'c5d1a84298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qaApprovedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
      storageConditions: 'Deep cold storage (2°C to 8°C), do not freeze',
    },
  });

  const b5 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-005' },
    update: { currentOwnerId: pharmacy.id },
    create: {
      batchNumber: 'BATCH-2026-005',
      productId: p5.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: pharmacy.id,
      quantity: 1800,
      unitPrice: 75.00,
      status: 'DELIVERED',
      qaDocumentHash: 'f4e2b9149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c441',
      qaApprovedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 600 * 24 * 60 * 60 * 1000),
      storageConditions: 'Controlled room temperature (15°C to 25°C)',
    },
  });

  const b6 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-006' },
    update: { currentOwnerId: hospital.id },
    create: {
      batchNumber: 'BATCH-2026-006',
      productId: p6.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: hospital.id,
      quantity: 800,
      unitPrice: 210.00,
      status: 'RECALLED',
      qaDocumentHash: '1a9e3f4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qaApprovedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000),
      storageConditions: 'Double-locked narcotics safe (15°C to 25°C)',
    },
  });

  const b7 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-007' },
    update: { currentOwnerId: distributor.id },
    create: {
      batchNumber: 'BATCH-2026-007',
      productId: p7.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: distributor.id,
      quantity: 4000,
      unitPrice: 150.00,
      status: 'APPROVED',
      qaDocumentHash: '9d3a7c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c443',
      qaApprovedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      storageConditions: 'Continuous cold storage (2°C to 8°C) with continuous IoT telemetry',
    },
  });

  const b8 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-008' },
    update: { currentOwnerId: hospital.id },
    create: {
      batchNumber: 'BATCH-2026-008',
      productId: p8.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: hospital.id,
      quantity: 600,
      unitPrice: 2400.00,
      status: 'DELIVERED',
      qaDocumentHash: '2f6c8d4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      qaApprovedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      manufacturedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 480 * 24 * 60 * 60 * 1000),
      storageConditions: 'Protect from light, do not refrigerate, store at 20°C to 25°C',
    },
  });

  const b9 = await prisma.batch.upsert({
    where: { batchNumber: 'BATCH-2026-009' },
    update: { currentOwnerId: manufacturer.id },
    create: {
      batchNumber: 'BATCH-2026-009',
      productId: p1.id,
      manufacturerId: manufacturer.id,
      currentOwnerId: manufacturer.id,
      quantity: 12000,
      unitPrice: 12.50,
      status: 'PENDING_QA',
      qaDocumentHash: null,
      qaApprovedAt: null,
      manufacturedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
      storageConditions: 'Warehouse Quarantine Bay 4-B',
    },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: manufacturer.id, batchId: b1.id } },
    update: { quantity: 5000, reservedQty: 0 },
    create: { organizationId: manufacturer.id, batchId: b1.id, quantity: 5000, reservedQty: 0 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: manufacturer.id, batchId: b2.id } },
    update: { quantity: 3500, reservedQty: 3500 },
    create: { organizationId: manufacturer.id, batchId: b2.id, quantity: 3500, reservedQty: 3500 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: manufacturer.id, batchId: b9.id } },
    update: { quantity: 12000, reservedQty: 0 },
    create: { organizationId: manufacturer.id, batchId: b9.id, quantity: 12000, reservedQty: 0 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: distributor.id, batchId: b3.id } },
    update: { quantity: 1200, reservedQty: 200 },
    create: { organizationId: distributor.id, batchId: b3.id, quantity: 1200, reservedQty: 200 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: distributor.id, batchId: b7.id } },
    update: { quantity: 4000, reservedQty: 0 },
    create: { organizationId: distributor.id, batchId: b7.id, quantity: 4000, reservedQty: 0 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: hospital.id, batchId: b4.id } },
    update: { quantity: 2500, reservedQty: 0 },
    create: { organizationId: hospital.id, batchId: b4.id, quantity: 2500, reservedQty: 0 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: hospital.id, batchId: b6.id } },
    update: { quantity: 800, reservedQty: 800 },
    create: { organizationId: hospital.id, batchId: b6.id, quantity: 800, reservedQty: 800 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: hospital.id, batchId: b8.id } },
    update: { quantity: 600, reservedQty: 0 },
    create: { organizationId: hospital.id, batchId: b8.id, quantity: 600, reservedQty: 0 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: pharmacy.id, batchId: b5.id } },
    update: { quantity: 1800, reservedQty: 0 },
    create: { organizationId: pharmacy.id, batchId: b5.id, quantity: 1800, reservedQty: 0 },
  });

  await prisma.inventory.upsert({
    where: { organizationId_batchId: { organizationId: pharmacy.id, batchId: b1.id } },
    update: { quantity: 650, reservedQty: 0 },
    create: { organizationId: pharmacy.id, batchId: b1.id, quantity: 650, reservedQty: 0 },
  });

  const existingTransfers = await prisma.transfer.count();
  if (existingTransfers === 0) {
    await prisma.transfer.create({
      data: {
        batchId: b2.id,
        senderId: manufacturer.id,
        receiverId: distributor.id,
        quantity: 3500,
        status: 'INITIATED',
        notes: 'Dispatched via Express Pharma Fleet GPS-9912. Cold chain monitored.',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_init_002',
      },
    });

    await prisma.transfer.create({
      data: {
        batchId: b3.id,
        senderId: manufacturer.id,
        receiverId: distributor.id,
        quantity: 1200,
        status: 'DELIVERED',
        shippedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        notes: 'Direct air freight Mumbai to Delhi, sealed tamper-evident container',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_deliv_003',
      },
    });

    await prisma.transfer.create({
      data: {
        batchId: b4.id,
        senderId: distributor.id,
        receiverId: hospital.id,
        quantity: 2500,
        status: 'DELIVERED',
        shippedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        notes: 'Priority hospital supply, refrigerated van logger confirmed 4.1C average',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_deliv_004',
      },
    });

    await prisma.transfer.create({
      data: {
        batchId: b5.id,
        senderId: distributor.id,
        receiverId: pharmacy.id,
        quantity: 1800,
        status: 'DELIVERED',
        shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        notes: 'Weekly scheduled retail dispensing shipment',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_deliv_005',
      },
    });

    await prisma.transfer.create({
      data: {
        batchId: b6.id,
        senderId: distributor.id,
        receiverId: hospital.id,
        quantity: 800,
        status: 'DELIVERED',
        shippedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
        notes: 'NDPS Section 4 compliant narcotics custody transfer, verified biometrics',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_deliv_006',
      },
    });

    await prisma.transfer.create({
      data: {
        batchId: b8.id,
        senderId: distributor.id,
        receiverId: hospital.id,
        quantity: 600,
        status: 'DELIVERED',
        shippedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        notes: 'Oncology ward specialized handling, hazardous drug packaging',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_deliv_008',
      },
    });

    await prisma.transfer.create({
      data: {
        batchId: b1.id,
        senderId: manufacturer.id,
        receiverId: pharmacy.id,
        quantity: 650,
        status: 'DELIVERED',
        shippedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        receivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: 'Direct manufacturer fast-track replenishment',
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_deliv_001b',
      },
    });
  }

  const existingRecalls = await prisma.recall.count();
  if (existingRecalls === 0) {
    const recall = await prisma.recall.create({
      data: {
        reason: 'Sub-potency excursion identified during post-marketing surveillance',
        description: 'Mandatory Class-II recall. All healthcare providers, distributors and hospital wards must quarantine remaining stock in bio-secure vault immediately.',
        status: 'INITIATED',
        initiatorId: regulator.id,
        ledgerTxStatus: 'CONFIRMED',
        ledgerTxId: 'tx_fabric_recall_006',
        affectedBatches: {
          create: [
            {
              batchId: b6.id,
              acknowledgedAt: new Date(),
              acknowledgedBy: 'Chief Pharmacist - Metro General',
            },
          ],
        },
      },
    });
    console.log('   Created demo recall:', recall.id);
  }

  const existingLedgerTxs = await prisma.ledgerTransaction.count();
  if (existingLedgerTxs === 0) {
    const txEvents = [
      { batchId: b1.id, eventType: 'BATCH_CREATED', fabricTxId: 'tx_0a4b7c112233', status: 'CONFIRMED', payload: { batchNumber: b1.batchNumber, qty: 5000, mfr: 'DEMO Pharma Pvt Ltd' } },
      { batchId: b1.id, eventType: 'BATCH_APPROVED', fabricTxId: 'tx_1b5c8d223344', status: 'CONFIRMED', payload: { batchNumber: b1.batchNumber, qaHash: b1.qaDocumentHash } },
      { batchId: b2.id, eventType: 'BATCH_CREATED', fabricTxId: 'tx_2c6d9e334455', status: 'CONFIRMED', payload: { batchNumber: b2.batchNumber, qty: 3500, mfr: 'DEMO Pharma Pvt Ltd' } },
      { batchId: b2.id, eventType: 'CUSTODY_TRANSFERRED', fabricTxId: 'tx_3d7e0f445566', status: 'CONFIRMED', payload: { batchNumber: b2.batchNumber, to: 'DEMO Distrib Co', qty: 3500 } },
      { batchId: b4.id, eventType: 'RECEIPT_CONFIRMED', fabricTxId: 'tx_4e8f1a556677', status: 'CONFIRMED', payload: { batchNumber: b4.batchNumber, receiver: 'Metro General Hospital', temp: '4.1C' } },
      { batchId: b6.id, eventType: 'RECALL_INITIATED', fabricTxId: 'tx_5f9a2b667788', status: 'CONFIRMED', payload: { batchNumber: b6.batchNumber, initiator: 'DEMO CDSCO', reason: 'Sub-potency' } },
      { batchId: b6.id, eventType: 'RECALL_ACKNOWLEDGED', fabricTxId: 'tx_6a0b3c778899', status: 'CONFIRMED', payload: { batchNumber: b6.batchNumber, org: 'Metro General Hospital' } },
    ];

    for (const tx of txEvents) {
      await prisma.ledgerTransaction.create({ data: tx });
    }
  }

  console.log('✅ Comprehensive Seed complete!');
  console.log('');
  console.log('   All Demo Credentials (Password: Dev@1234!):');
  console.log('   1. Manufacturer: mfr.admin@demo.invalid');
  console.log('   2. Distributor:  dist.admin@demo.invalid');
  console.log('   3. Hospital:     hosp.admin@demo.invalid');
  console.log('   4. Pharmacy:     pharmacy.admin@demo.invalid');
  console.log('   5. Regulator:    regulator@demo.invalid');
  console.log('   6. Admin:        admin@demo.invalid');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
