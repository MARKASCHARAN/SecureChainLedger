// src/routes/index.js
// Mounts all versioned API routes under /api/v1

import { Router } from 'express';
import authRoutes    from '../modules/auth/auth.routes.js';
import batchRoutes   from '../modules/batches/batch.routes.js';
import orgRoutes     from '../modules/organizations/org.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import transferRoutes from '../modules/transfers/transfer.routes.js';

import inventoryRoutes from '../modules/inventory/inventory.routes.js';
import recallRoutes    from '../modules/recalls/recall.routes.js';
import verificationRoutes from '../modules/verification/verification.routes.js';
import aiRoutes           from '../modules/ai/ai.routes.js';

const router = Router();

router.use('/auth',          authRoutes);
router.use('/batches',       batchRoutes);
router.use('/organizations', orgRoutes);
router.use('/products',      productRoutes);
router.use('/transfers',     transferRoutes);
router.use('/inventory',     inventoryRoutes);
router.use('/recalls',       recallRoutes);
router.use('/verification',  verificationRoutes);
router.use('/ai',            aiRoutes);

export default router;
