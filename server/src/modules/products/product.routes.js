// src/modules/products/product.routes.js

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createProductSchema, updateProductSchema, productQuerySchema } from './product.schema.js';
import {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
} from './product.controller.js';

const router = Router();
router.use(authenticate);

router.get('/',     validate(productQuerySchema, 'query'), listProductsHandler);
router.post('/',    authorize('MANUFACTURER'),  validate(createProductSchema),  createProductHandler);
router.get('/:id',                                                               getProductHandler);
router.patch('/:id', authorize('MANUFACTURER'), validate(updateProductSchema),  updateProductHandler);

export default router;
