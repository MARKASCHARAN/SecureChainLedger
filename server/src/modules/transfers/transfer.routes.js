// src/modules/transfers/transfer.routes.js

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  initiateTransferSchema,
  confirmReceiptSchema,
  rejectTransferSchema,
  transferQuerySchema,
} from './transfer.schema.js';
import {
  initiateTransferHandler,
  confirmReceiptHandler,
  rejectTransferHandler,
  listTransfersHandler,
  getTransferHandler,
} from './transfer.controller.js';

const router = Router();
router.use(authenticate);

router.get('/',                                        validate(transferQuerySchema, 'query'), listTransfersHandler);
router.post('/',                                       validate(initiateTransferSchema),       initiateTransferHandler);
router.get('/:id',                                                                             getTransferHandler);
router.post('/:id/confirm', validate(confirmReceiptSchema),                                    confirmReceiptHandler);
router.post('/:id/reject',  validate(rejectTransferSchema),                                   rejectTransferHandler);

export default router;
