import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env explicitly if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

export const envSchema = z.object({
  // NON-SECRET CONFIGURATION
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  
  // BUSINESS CONFIGURATION
  CLINIC_TIMEZONE: z.string().min(1).default('Asia/Kolkata'),
  PAGINATION_DEFAULT_LIMIT: z.coerce.number().int().positive().default(20),

  // SECRET CONFIGURATION
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long for security"),
});

// Parse and strictly validate
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  
  // In a test environment, we might want to throw to catch it instead of killing the process immediately.
  if (process.env.NODE_ENV === 'test') {
    throw new Error('Invalid environment variables');
  } else {
    process.exit(1);
  }
}

export const env = _env.data;
