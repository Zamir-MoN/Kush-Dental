import { env } from './env.js';

export const config = {
  server: {
    env: env.NODE_ENV,
    port: env.PORT,
    corsOrigin: env.CORS_ORIGIN,
  },
  database: {
    url: env.DATABASE_URL,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
  },
  clinic: {
    timezone: env.CLINIC_TIMEZONE,
    paginationLimit: env.PAGINATION_DEFAULT_LIMIT,
  },
  logging: {
    level: env.LOG_LEVEL,
  }
} as const;
