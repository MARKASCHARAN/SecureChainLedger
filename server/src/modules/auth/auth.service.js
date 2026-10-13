// src/modules/auth/auth.service.js
// Core authentication business logic.
// Handles registration, login, token generation, refresh and logout.

import argon2 from 'argon2';
import * as jose from 'jose';
import { createHash, randomBytes } from 'crypto';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { AuthError, ConflictError, NotFoundError } from '../../lib/errors.js';

const ACCESS_SECRET = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

/**
 * Hash a raw refresh token for safe storage (never store the raw token).
 */
function hashToken(raw) {
  return createHash('sha256').update(raw).digest('hex');
}

/**
 * Generates a signed JWT access token.
 */
async function signAccessToken(userId, role, organizationId) {
  return new jose.SignJWT({ role, organizationId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_EXPIRES_IN)
    .sign(ACCESS_SECRET);
}

/**
 * Registers a new user. Throws ConflictError if email already exists.
 */
export async function register({ email, password, firstName, lastName, organizationId, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('An account with this email already exists.');

  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org) throw new NotFoundError('Organization');

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, role, organizationId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, organizationId: true },
  });

  return user;
}

/**
 * Authenticates a user and returns access + refresh tokens.
 */
export async function login({ email, password }, { userAgent, ipAddress } = {}) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Constant-time rejection to prevent email enumeration
  if (!user) {
    await argon2.hash('dummy-prevent-timing-attack');
    throw new AuthError('Invalid email or password.');
  }

  if (user.status !== 'ACTIVE') throw new AuthError('Account is not active.');

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) throw new AuthError('Invalid email or password.');

  const accessToken = await signAccessToken(user.id, user.role, user.organizationId);

  const rawRefresh = randomBytes(64).toString('base64url');
  const tokenHash = hashToken(rawRefresh);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshSession.create({
    data: { userId: user.id, tokenHash, expiresAt, userAgent, ipAddress },
  });

  return {
    accessToken,
    refreshToken: rawRefresh,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
    },
  };
}

/**
 * Rotates the refresh token. Revokes the old session and issues a new pair.
 */
export async function refresh(rawRefreshToken) {
  const tokenHash = hashToken(rawRefreshToken);
  const session = await prisma.refreshSession.findUnique({ where: { tokenHash } });

  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    throw new AuthError('Invalid or expired refresh token.');
  }

  // Revoke old session
  await prisma.refreshSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.status !== 'ACTIVE') throw new AuthError('Account not active.');

  const accessToken = await signAccessToken(user.id, user.role, user.organizationId);
  const rawRefresh = randomBytes(64).toString('base64url');
  const newHash = hashToken(rawRefresh);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshSession.create({
    data: { userId: user.id, tokenHash: newHash, expiresAt },
  });

  return { accessToken, refreshToken: rawRefresh };
}

/**
 * Revokes a specific refresh session (logout).
 */
export async function logout(rawRefreshToken) {
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshSession.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
