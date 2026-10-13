// src/modules/transfers/transfer.controller.js

import {
  initiateTransfer,
  confirmReceipt,
  rejectTransfer,
  listTransfers,
  getTransfer,
} from './transfer.service.js';
import { sendSuccess } from '../../lib/response.js';

export async function initiateTransferHandler(req, res, next) {
  try {
    const transfer = await initiateTransfer(req.body, req.user);
    return sendSuccess(res, { transfer }, 201, 'Transfer initiated.');
  } catch (err) { next(err); }
}

export async function confirmReceiptHandler(req, res, next) {
  try {
    const transfer = await confirmReceipt(req.params.id, req.user, req.body);
    return sendSuccess(res, { transfer }, 200, 'Receipt confirmed. Custody transferred.');
  } catch (err) { next(err); }
}

export async function rejectTransferHandler(req, res, next) {
  try {
    const transfer = await rejectTransfer(req.params.id, req.user, req.body.reason);
    return sendSuccess(res, { transfer }, 200, 'Transfer rejected.');
  } catch (err) { next(err); }
}

export async function listTransfersHandler(req, res, next) {
  try {
    const result = await listTransfers(req.query, req.user);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getTransferHandler(req, res, next) {
  try {
    const transfer = await getTransfer(req.params.id, req.user);
    return sendSuccess(res, { transfer });
  } catch (err) { next(err); }
}
