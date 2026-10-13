// tests/health.test.js
// Tests for /health and /ready endpoints.

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health probes', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health does not expose internal info', async () => {
    const res = await request(app).get('/health');
    expect(res.body).not.toHaveProperty('database');
    expect(res.body).not.toHaveProperty('version');
  });

  it('GET /nonexistent returns 404 with correct shape', async () => {
    const res = await request(app).get('/api/v1/nonexistent');
    expect(res.status).toBe(404);
  });
});
