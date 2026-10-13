// src/modules/ai/ai.routes.js
import { Router } from 'express';
import { getBatchAiAnalysisHandler } from './ai.controller.js';

const router = Router();

// Publicly accessible AI batch intelligence (also consumable by consumer verification)
router.get('/batches/:batchNumber/analyze', getBatchAiAnalysisHandler);

export default router;
