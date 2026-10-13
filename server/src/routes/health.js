// src/routes/health.js
// /health — basic liveness probe
// /ready  — readiness probe (checks DB)

import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ready', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'not ready', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

export default router;
