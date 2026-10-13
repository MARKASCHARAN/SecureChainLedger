// src/modules/inventory/inventory.controller.js
import { listInventory, getInventoryByBatch } from './inventory.service.js';
import { sendSuccess } from '../../lib/response.js';

export async function listInventoryHandler(req, res, next) {
  try {
    const result = await listInventory(req.query, req.user);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getInventoryByBatchHandler(req, res, next) {
  try {
    const item = await getInventoryByBatch(req.params.batchId, req.user);
    return sendSuccess(res, { inventory: item });
  } catch (err) { next(err); }
}
