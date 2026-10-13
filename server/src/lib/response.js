// src/lib/response.js
// Consistent API response envelope used by all controllers.

/**
 * Send a successful JSON response.
 * @param {import('express').Response} res
 * @param {object} data
 * @param {number} [statusCode=200]
 * @param {string} [message]
 */
export function sendSuccess(res, data = null, statusCode = 200, message = 'OK') {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send an error JSON response. Never exposes stack traces in production.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} code
 * @param {string} message
 * @param {any} [details]
 */
export function sendError(res, statusCode, code, message, details = undefined) {
  const body = { success: false, code, message };
  if (details !== undefined) body.details = details;
  return res.status(statusCode).json(body);
}
