// src/modules/verification/verification.schema.js
import { z } from 'zod';

export const verifyBatchQuerySchema = z.object({
  batchNumber: z.string().min(1).max(100),
});

export const verifyHashSchema = z.object({
  batchNumber: z.string().min(1).max(100),
  documentHash: z.string().min(10).max(256),
});
