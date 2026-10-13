// src/modules/products/product.schema.js

import { z } from 'zod';

export const createProductSchema = z.object({
  genericName:   z.string().min(2).max(200),
  brandName:     z.string().min(2).max(200),
  formulation:   z.enum(['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Powder', 'Patch', 'Other']),
  strength:      z.string().min(1).max(100),        // e.g. "500mg", "10mg/5ml"
  scheduledDrug: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  genericName:  z.string().optional(),
  formulation:  z.string().optional(),
  page:         z.coerce.number().int().positive().default(1),
  pageSize:     z.coerce.number().int().min(1).max(100).default(20),
});
