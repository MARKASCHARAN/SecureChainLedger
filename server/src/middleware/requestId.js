// src/middleware/requestId.js
// Attaches a unique request ID to every incoming request for log correlation.

import { randomUUID } from 'crypto';

export function requestId(req, res, _next) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.id);
  _next();
}
