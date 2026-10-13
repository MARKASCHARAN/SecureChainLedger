// src/routes/index.js
// Mounts all versioned API routes under /api/v1

import { Router } from 'express';
import authRoutes    from '../modules/auth/auth.routes.js';
import batchRoutes   from '../modules/batches/batch.routes.js';
import orgRoutes     from '../modules/organizations/org.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import transferRoutes from '../modules/transfers/transfer.routes.js';

const router = Router();

router.use('/auth',          authRoutes);
router.use('/batches',       batchRoutes);
router.use('/organizations', orgRoutes);
router.use('/products',      productRoutes);
router.use('/transfers',     transferRoutes);

// Placeholder stubs — filled in subsequent phases
// router.use('/inventory',   inventoryRoutes);
// router.use('/recalls',     recallRoutes);
// router.use('/verification',verificationRoutes);

export default router;
