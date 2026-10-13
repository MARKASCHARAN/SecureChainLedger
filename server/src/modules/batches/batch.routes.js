// src/modules/batches/batch.routes.js

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createBatchSchema, batchQuerySchema } from './batch.schema.js';
import {
  createBatchHandler,
  listBatchesHandler,
  getBatchHandler,
  approveBatchHandler,
} from './batch.controller.js';

const router = Router();

// All batch routes require authentication
router.use(authenticate);

router.get('/',                                             validate(batchQuerySchema, 'query'), listBatchesHandler);
router.post('/',  authorize('MANUFACTURER'),               validate(createBatchSchema),          createBatchHandler);
router.get('/:id',                                                                               getBatchHandler);
router.patch('/:id/approve', authorize('MANUFACTURER'),                                          approveBatchHandler);

export default router;
