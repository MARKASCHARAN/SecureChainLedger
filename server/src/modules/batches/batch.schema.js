// src/modules/batches/batch.schema.js

import { z } from 'zod';

export const createBatchSchema = z.object({
  batchNumber:       z.string().min(3).max(50),
  productId:         z.string().cuid(),
  quantity:          z.number().int().positive(),
  unitPrice:         z.number().positive(),
  manufacturedAt:    z.coerce.date(),
  expiresAt:         z.coerce.date(),
  storageConditions: z.string().max(500).optional(),
  qaDocumentHash:    z.string().optional(),
}).refine(d => d.expiresAt > d.manufacturedAt, {
  message: 'expiresAt must be after manufacturedAt',
  path: ['expiresAt'],
});

export const updateBatchStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING_QA', 'APPROVED', 'IN_TRANSIT', 'DELIVERED', 'RECALLED', 'EXPIRED']),
});

export const batchQuerySchema = z.object({
  status:   z.string().optional(),
  page:     z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
