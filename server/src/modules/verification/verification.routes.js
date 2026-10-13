// src/modules/verification/verification.routes.js
import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { verifyHashSchema } from './verification.schema.js';
import { verifyBatchHandler, verifyHashHandler } from './verification.controller.js';

const router = Router();

// Public provenance lookup by batch number — accessible without login (for QR scans)
router.get('/:batchNumber', verifyBatchHandler);

// Validate QA documentation hash
router.post('/verify-hash', validate(verifyHashSchema), verifyHashHandler);

export default router;
