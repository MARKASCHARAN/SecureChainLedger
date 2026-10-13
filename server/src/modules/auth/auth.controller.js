// src/modules/auth/auth.controller.js
// HTTP handlers for authentication endpoints.

import { register, login, refresh, logout } from './auth.service.js';
import { sendSuccess } from '../../lib/response.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function registerHandler(req, res, next) {
  try {
    const user = await register(req.body);
    return sendSuccess(res, { user }, 201, 'Account created successfully.');
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await login(req.body, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });

    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);

    return sendSuccess(res, { accessToken, user }, 200, 'Login successful.');
  } catch (err) {
    next(err);
  }
}

export async function refreshHandler(req, res, next) {
  try {
    const raw = req.cookies?.refresh_token || req.body?.refreshToken;
    const { accessToken, refreshToken } = await refresh(raw);

    res.cookie('refresh_token', refreshToken, COOKIE_OPTS);

    return sendSuccess(res, { accessToken }, 200, 'Token refreshed.');
  } catch (err) {
    next(err);
  }
}

export async function logoutHandler(req, res, next) {
  try {
    const raw = req.cookies?.refresh_token || req.body?.refreshToken;
    if (raw) await logout(raw);

    res.clearCookie('refresh_token');
    return sendSuccess(res, null, 200, 'Logged out.');
  } catch (err) {
    next(err);
  }
}

export async function meHandler(req, res) {
  return sendSuccess(res, { user: req.user });
}
