// src/middleware/auth.js
// JWT authentication and RBAC authorization middleware.
// Uses JOSE for stateless JWT verification.

import * as jose from 'jose';
import { env } from '../config/env.js';
import { AuthError, ForbiddenError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';

const ACCESS_SECRET = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

/**
 * Verifies the access token from the Authorization header or secure cookie.
 * Attaches the decoded user payload to req.user.
 */
export async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.cookies?.access_token;

    if (!token) throw new AuthError();

    const { payload } = await jose.jwtVerify(token, ACCESS_SECRET, {
      algorithms: ['HS256'],
    });

    // Verify the user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, status: true, organizationId: true },
    });

    if (!user || user.status !== 'ACTIVE') throw new AuthError('Account not found or inactive');

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof AuthError) return next(err);
    if (err instanceof jose.errors.JWTExpired) return next(new AuthError('Token expired'));
    return next(new AuthError('Invalid token'));
  }
}

/**
 * RBAC guard — only allows users whose role is in the allowedRoles array.
 * Always call after authenticate().
 * @param {...string} allowedRoles
 */
export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AuthError());
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Role '${req.user.role}' is not permitted to perform this action.`));
    }
    next();
  };
}

/**
 * Organization scope guard — prevents cross-org data access.
 * Extracts :orgId from route params and compares against req.user.organizationId.
 * Regulators and Admins are exempt.
 */
export function scopeToOrg(req, _res, next) {
  const exemptRoles = ['REGULATOR', 'ADMIN'];
  if (exemptRoles.includes(req.user?.role)) return next();

  const routeOrgId = req.params.orgId;
  if (routeOrgId && routeOrgId !== req.user?.organizationId) {
    return next(new ForbiddenError('Access to this organization is denied.'));
  }
  next();
}
