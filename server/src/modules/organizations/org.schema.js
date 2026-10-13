// src/modules/organizations/org.schema.js

import { z } from 'zod';

export const createOrgSchema = z.object({
  name:         z.string().min(2).max(200),
  type:         z.enum(['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR']),
  licenseNo:    z.string().max(100).optional(),
  address:      z.string().max(500).optional(),
  city:         z.string().max(100).optional(),
  state:        z.string().max(100).optional(),
  country:      z.string().default('India'),
  contactName:  z.string().max(200).optional(),
  contactEmail: z.string().email().optional(),
  fabricMspId:  z.string().max(100).optional(),
});
