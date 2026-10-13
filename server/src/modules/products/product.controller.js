// src/modules/products/product.controller.js

import { createProduct, listProducts, getProduct, updateProduct } from './product.service.js';
import { sendSuccess } from '../../lib/response.js';

export async function createProductHandler(req, res, next) {
  try {
    const product = await createProduct(req.body, req.user);
    return sendSuccess(res, { product }, 201, 'Product created.');
  } catch (err) { next(err); }
}

export async function listProductsHandler(req, res, next) {
  try {
    const result = await listProducts(req.query, req.user);
    return sendSuccess(res, result);
  } catch (err) { next(err); }
}

export async function getProductHandler(req, res, next) {
  try {
    const product = await getProduct(req.params.id, req.user);
    return sendSuccess(res, { product });
  } catch (err) { next(err); }
}

export async function updateProductHandler(req, res, next) {
  try {
    const product = await updateProduct(req.params.id, req.body, req.user);
    return sendSuccess(res, { product }, 200, 'Product updated.');
  } catch (err) { next(err); }
}
