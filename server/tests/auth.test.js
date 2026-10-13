// tests/auth.test.js
// Integration tests for auth endpoints.
// These tests run against the actual DB; the DB must be running and migrated.
// Uses .env.test for connection details.

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { prisma } from '../src/lib/prisma.js';
import app from '../src/app.js';

const TEST_EMAIL = `test-${Date.now()}@test.invalid`;
const TEST_PASSWORD = 'TestPass@1234';

let testOrgId;

beforeAll(async () => {
  // Create a test org
  const org = await prisma.organization.create({
    data: {
      name: `Test Org ${Date.now()}`,
      type: 'MANUFACTURER',
      status: 'ACTIVE',
    },
  });
  testOrgId = org.id;
});

afterAll(async () => {
  // Cleanup: delete test user + org
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.organization.delete({ where: { id: testOrgId } });
  await prisma.$disconnect();
});

describe('POST /api/v1/auth/register', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email:          TEST_EMAIL,
        password:       TEST_PASSWORD,
        firstName:      'Test',
        lastName:       'User',
        role:           'MANUFACTURER',
        organizationId: testOrgId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(TEST_EMAIL);
    expect(res.body.data.user).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email:          TEST_EMAIL,
        password:       TEST_PASSWORD,
        firstName:      'Test',
        lastName:       'User',
        role:           'MANUFACTURER',
        organizationId: testOrgId,
      });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('CONFLICT');
  });

  it('rejects weak passwords', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email:          `another-${Date.now()}@test.invalid`,
        password:       'weak',
        firstName:      'Test',
        lastName:       'User',
        role:           'MANUFACTURER',
        organizationId: testOrgId,
      });

    expect(res.status).toBe(422);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('logs in with valid credentials and returns access token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_EMAIL, password: 'WrongPass@999' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('rejects non-existent user with same 401 (no enumeration)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@test.invalid', password: 'AnyPass@1' });

    expect(res.status).toBe(401);
    // Message must be identical to wrong-password case
    expect(res.body.message).toBe('Invalid email or password.');
  });
});

describe('GET /api/v1/auth/me', () => {
  it('returns user info with valid token', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    const { accessToken } = loginRes.body.data;

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(TEST_EMAIL);
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
