// src/modules/transfers/transfer.schema.js

import { z } from 'zod';

export const initiateTransferSchema = z.object({
  batchId:    z.string().cuid(),
  receiverId: z.string().cuid(),
  quantity:   z.number().int().positive(),
  notes:      z.string().max(1000).optional(),
});

export const confirmReceiptSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export const rejectTransferSchema = z.object({
  reason: z.string().min(1).max(500),
});

export const transferQuerySchema = z.object({
  status:   z.enum(['INITIATED', 'IN_TRANSIT', 'DELIVERED', 'REJECTED', 'CANCELLED']).optional(),
  role:     z.enum(['sender', 'receiver']).optional(),
  page:     z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
