// src/server.js
// Server entry point — connects to the database then starts listening.
// Handles graceful shutdown on SIGTERM / SIGINT.

import app from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';

async function start() {
  // Verify DB connectivity before accepting traffic
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection verified');
  } catch (err) {
    logger.fatal({ err }, 'Cannot connect to database — aborting startup');
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`SecureChainLedger API started on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  async function shutdown(signal) {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Server and database connections closed');
      process.exit(0);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error('Forcing exit after shutdown timeout');
      process.exit(1);
    }, 10_000);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled promise rejection');
  });
}

start();
