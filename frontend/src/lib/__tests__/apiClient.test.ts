import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from '../apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('throws ApiError with server details on 400 Bad Request', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ detail: 'Invalid Idempotency-Key format. Must be a UUID.' })
    };
    vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

    try {
      await apiClient('/api/test');
      expect.fail('Should have thrown ApiError');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e.name).toBe('ApiError');
      expect(e.status).toBe(400);
      expect(e.message).toBe('Invalid Idempotency-Key format. Must be a UUID.');
    }
  });

  it('throws ApiError with 0 status on Network error when fetch completely fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    try {
      await apiClient('/api/test');
      expect.fail('Should have thrown ApiError');
    } catch (e: any) {
      expect(e.name).toBe('ApiError');
      expect(e.status).toBe(0);
      expect(e.message).toBe('Network error or server unreachable');
    }
  });
});
