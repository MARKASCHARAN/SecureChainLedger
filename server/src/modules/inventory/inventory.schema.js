// src/modules/inventory/inventory.schema.js
import { z } from 'zod';

export const inventoryQuerySchema = z.object({
  page:     z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
