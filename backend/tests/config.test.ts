import { describe, it, expect } from 'vitest';
import { envSchema } from '../src/config/env.js';

describe('Configuration Validation', () => {
  
  const validEnv = {
    NODE_ENV: 'production',
    PORT: '8080',
    CORS_ORIGIN: 'https://kushdental.com',
    DATABASE_URL: 'postgresql://u:p@localhost/db',
    JWT_SECRET: 'this-is-a-super-secret-key-that-is-at-least-32-chars',
  };

  it('should pass with valid configuration', () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8080);
      expect(result.data.NODE_ENV).toBe('production');
    }
  });

  it('should use safe defaults when optional variables are missing', () => {
    const minimalEnv = {
      DATABASE_URL: 'postgresql://u:p@localhost/db',
      JWT_SECRET: 'this-is-a-super-secret-key-that-is-at-least-32-chars',
    };
    const result = envSchema.safeParse(minimalEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(3000);
      expect(result.data.CLINIC_TIMEZONE).toBe('Asia/Kolkata');
    }
  });

  it('should fail if required configuration (DATABASE_URL) is missing', () => {
    const invalidEnv = { ...validEnv };
    delete (invalidEnv as any).DATABASE_URL;
    
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it('should fail if JWT_SECRET is missing (Insecure Default Protection)', () => {
    const invalidEnv = { ...validEnv };
    delete (invalidEnv as any).JWT_SECRET;
    
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it('should fail if JWT_SECRET is too short (Insecure Default Protection)', () => {
    const invalidEnv = { ...validEnv, JWT_SECRET: 'too-short' };
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it('should fail if PORT is invalid type', () => {
    const invalidEnv = { ...validEnv, PORT: 'not-a-number' };
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it('should fail if CORS_ORIGIN is not a URL', () => {
    const invalidEnv = { ...validEnv, CORS_ORIGIN: 'not-a-url' };
    const result = envSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

});
