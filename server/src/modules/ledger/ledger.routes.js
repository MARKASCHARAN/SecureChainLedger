// src/modules/ledger/ledger.routes.js
import { Router } from 'express';
import { getLedgerTransactionsHandler } from './ledger.controller.js';

const router = Router();

// Publicly inspectable on-chain ledger audit log
router.get('/transactions', getLedgerTransactionsHandler);

export default router;
