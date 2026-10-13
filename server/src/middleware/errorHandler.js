// src/middleware/errorHandler.js
// Centralized error handler — must be registered last in Express.

import { AppError, ValidationError } from '../lib/errors.js';
import { sendError } from '../lib/response.js';
import { logger } from '../lib/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  // Prisma known-request errors
  if (err.code === 'P2002') {
    return sendError(res, 409, 'CONFLICT', 'A record with that value already exists.');
  }
  if (err.code === 'P2025') {
    return sendError(res, 404, 'NOT_FOUND', 'Record not found.');
  }

  // Zod validation errors bubbled up manually
  if (err.name === 'ZodError') {
    return sendError(res, 422, 'VALIDATION_ERROR', 'Request validation failed.', err.flatten().fieldErrors);
  }

  if (err instanceof ValidationError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message);
  }

  // Unexpected errors — log full details server-side, never expose to client
  logger.error({ err, reqId: req.id }, 'Unhandled error');
  return sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
}
