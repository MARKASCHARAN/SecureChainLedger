// src/modules/recalls/recall.routes.js
import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { initiateRecallSchema, acknowledgeRecallSchema, recallQuerySchema } from './recall.schema.js';
import {
  initiateRecallHandler,
  acknowledgeRecallHandler,
  listRecallsHandler,
  getRecallHandler,
} from './recall.controller.js';

const router = Router();
router.use(authenticate);

router.get('/',                            validate(recallQuerySchema, 'query'), listRecallsHandler);
router.post('/',                           authorize('REGULATOR', 'ADMIN', 'MANUFACTURER'), validate(initiateRecallSchema), initiateRecallHandler);
router.get('/:id',                                                               getRecallHandler);
router.post('/:id/acknowledge',            validate(acknowledgeRecallSchema),    acknowledgeRecallHandler);

export default router;
