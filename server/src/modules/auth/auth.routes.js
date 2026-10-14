import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema.js';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
} from './auth.controller.js';

import { prisma } from '../../lib/prisma.js';
import { sendSuccess } from '../../lib/response.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 150 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 50 : 2000,
  skip: () => process.env.NODE_ENV !== 'production',
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
});

router.get('/organizations', async (req, res, next) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, name: true, type: true },
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, { organizations: orgs });
  } catch (err) {
    next(err);
  }
});

router.post('/register', authLimiter, validate(registerSchema), registerHandler);
router.post('/login',    authLimiter, validate(loginSchema),    loginHandler);
router.post('/refresh',  authLimiter, validate(refreshSchema),  refreshHandler);
router.post('/logout',   logoutHandler);
router.get('/me',        authenticate, meHandler);

export default router;
