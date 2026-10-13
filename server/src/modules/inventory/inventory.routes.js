// src/modules/inventory/inventory.routes.js
import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { inventoryQuerySchema } from './inventory.schema.js';
import { listInventoryHandler, getInventoryByBatchHandler } from './inventory.controller.js';

const router = Router();
router.use(authenticate);

router.get('/', validate(inventoryQuerySchema, 'query'), listInventoryHandler);
router.get('/:batchId', getInventoryByBatchHandler);

export default router;
