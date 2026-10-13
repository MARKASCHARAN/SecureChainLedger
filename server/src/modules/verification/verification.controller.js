// src/modules/verification/verification.controller.js
import { verifyBatch, verifyDocumentHash } from './verification.service.js';
import { sendSuccess } from '../../lib/response.js';

export async function verifyBatchHandler(req, res, next) {
  try {
    const { batchNumber } = req.params;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const requestingUser = req.user || null;

    const result = await verifyBatch(batchNumber, { ipAddress, userAgent, requestingUser });
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function verifyHashHandler(req, res, next) {
  try {
    const { batchNumber, documentHash } = req.body;
    const result = await verifyDocumentHash(batchNumber, documentHash);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}
