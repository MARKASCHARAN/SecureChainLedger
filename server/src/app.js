// src/app.js
// Express application factory.
// Keeps all middleware, routes and error handling in one place.
// Does NOT start the server — that is done in server.js.

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import apiRouter from './routes/index.js';

const app = express();

// ─── Trust proxy (needed behind Docker / nginx / load balancer) ───────────────
app.set('trust proxy', 1);

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS — explicit allow-list only ─────────────────────────────────────────
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
}));

// ─── Request ID ───────────────────────────────────────────────────────────────
app.use(requestId);

// ─── Structured HTTP logging ──────────────────────────────────────────────────
app.use(pinoHttp({ logger, useLevel: 'debug', genReqId: req => req.id }));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', healthRouter);             // /health, /ready — unauthenticated
app.use('/api/v1', apiRouter);          // All business routes under /api/v1

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Route not found.' });
});

// ─── Global error handler — must be last ──────────────────────────────────────
app.use(errorHandler);

export default app;
