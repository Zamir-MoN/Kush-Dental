import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { Request, Response, NextFunction } from 'express';

describe('Health and API Endpoints', () => {
  it('GET /health/live should return 200 OK', async () => {
    const res = await request(app).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /health/ready should return 200 OK', async () => {
    const res = await request(app).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });

  it('Global error handler should return formatted API error', async () => {
    const res = await request(app).get('/test-error');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('TEST_ERROR');
    expect(res.body.error.message).toBe('Test Error');
    expect(res.body.correlationId).toBeDefined();
  });
});
