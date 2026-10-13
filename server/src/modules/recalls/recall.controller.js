// src/modules/recalls/recall.controller.js
import { initiateRecall, acknowledgeRecall, listRecalls, getRecall } from './recall.service.js';
import { sendSuccess } from '../../lib/response.js';

export async function initiateRecallHandler(req, res, next) {
  try {
    const recall = await initiateRecall(req.body, req.user);
    return sendSuccess(res, { recall }, 201, 'Recall initiated across the supply chain.');
  } catch (err) { next(err); }
}

export async function acknowledgeRecallHandler(req, res, next) {
  try {
    const acknowledged = await acknowledgeRecall(req.params.id, req.body, req.user);
    return sendSuccess(res, { acknowledged }, 200, 'Recall acknowledged and stock quarantined.');
  } catch (err) { next(err); }
}

export async function listRecallsHandler(req, res, next) {
  try {
    const result = await listRecalls(req.query);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getRecallHandler(req, res, next) {
  try {
    const recall = await getRecall(req.params.id);
    return sendSuccess(res, { recall });
  } catch (err) { next(err); }
}
