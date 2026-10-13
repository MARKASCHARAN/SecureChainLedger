// src/modules/recalls/recall.schema.js
import { z } from 'zod';

export const initiateRecallSchema = z.object({
  reason:       z.string().min(5).max(500),
  description:  z.string().max(2000).optional(),
  batchIds:     z.array(z.string().cuid()).min(1),
});

export const acknowledgeRecallSchema = z.object({
  batchId: z.string().cuid(),
  notes:   z.string().max(1000).optional(),
});

export const recallQuerySchema = z.object({
  status:   z.enum(['INITIATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  page:     z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
