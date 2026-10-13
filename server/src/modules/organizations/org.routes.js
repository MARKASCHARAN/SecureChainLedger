// src/modules/organizations/org.routes.js

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createOrgSchema } from './org.schema.js';
import { createOrganization, listOrganizations, getOrganization, updateOrganizationStatus } from './org.service.js';
import { sendSuccess } from '../../lib/response.js';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { type, page, pageSize } = req.query;
    const result = await listOrganizations({ type, page: Number(page) || 1, pageSize: Number(pageSize) || 20 });
    sendSuccess(res, result);
  } catch (err) { next(err); }
});

router.post('/', authorize('ADMIN'), validate(createOrgSchema), async (req, res, next) => {
  try {
    const org = await createOrganization(req.body);
    sendSuccess(res, { org }, 201, 'Organization created.');
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const org = await getOrganization(req.params.id);
    sendSuccess(res, { org });
  } catch (err) { next(err); }
});

router.patch('/:id/status', authorize('ADMIN', 'REGULATOR'), async (req, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']) }).parse(req.body);
    const org = await updateOrganizationStatus(req.params.id, status);
    sendSuccess(res, { org });
  } catch (err) { next(err); }
});

export default router;
