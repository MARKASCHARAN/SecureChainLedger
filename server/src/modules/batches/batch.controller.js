// src/modules/batches/batch.controller.js

import { createBatch, listBatches, getBatch, approveBatch } from './batch.service.js';
import { sendSuccess } from '../../lib/response.js';

export async function createBatchHandler(req, res, next) {
  try {
    const batch = await createBatch(req.body, req.user);
    return sendSuccess(res, { batch }, 201, 'Batch created successfully.');
  } catch (err) { next(err); }
}

export async function listBatchesHandler(req, res, next) {
  try {
    const result = await listBatches(req.query, req.user);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getBatchHandler(req, res, next) {
  try {
    const batch = await getBatch(req.params.id, req.user);
    return sendSuccess(res, { batch });
  } catch (err) { next(err); }
}

export async function approveBatchHandler(req, res, next) {
  try {
    const batch = await approveBatch(req.params.id, req.user);
    return sendSuccess(res, { batch }, 200, 'Batch approved.');
  } catch (err) { next(err); }
}
