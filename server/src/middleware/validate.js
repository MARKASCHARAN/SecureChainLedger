// src/middleware/validate.js
// Zod schema validation middleware factory.
// Usage: router.post('/path', validate(schema), controller)

import { ValidationError } from '../lib/errors.js';

/**
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} [target='body']
 */
export function validate(schema, target = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(new ValidationError('Validation failed', result.error.flatten().fieldErrors));
    }
    if (target === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else {
      req[target] = result.data;
    }
    next();
  };
}
