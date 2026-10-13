// src/modules/auth/auth.routes.js
// Auth route definitions with rate limiting applied.

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

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
});

router.post('/register', authLimiter, validate(registerSchema), registerHandler);
router.post('/login',    authLimiter, validate(loginSchema),    loginHandler);
router.post('/refresh',  authLimiter, validate(refreshSchema),  refreshHandler);
router.post('/logout',   logoutHandler);
router.get('/me',        authenticate, meHandler);

export default router;
