import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { randomUUID } from 'crypto';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

export const app = express();

// Correlation ID Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || randomUUID();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
});

// Middleware
app.use(helmet());
app.use(cors({ origin: config.server.corsOrigin, credentials: true }));
app.use(express.json());

// Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path !== '/health/live' && req.path !== '/health/ready') {
    logger.info({
      method: req.method,
      url: req.url,
      correlationId: req.headers['x-correlation-id'],
      ip: req.ip,
    }, 'Incoming Request');
  }
  next();
});

// Health Check Endpoints
app.get('/health/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/ready', (req: Request, res: Response) => {
  // In Phase 1, we just return true. Phase 2 will add DB check.
  res.status(200).json({ status: 'ready', timestamp: new Date().toISOString() });
});

if (config.server.env === 'test') {
  app.get('/test-error', (req: Request, res: Response, next: NextFunction) => {
    const err: any = new Error('Test Error');
    err.statusCode = 400;
    err.code = 'TEST_ERROR';
    next(err);
  });
}

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'];
  logger.error({ err, correlationId }, 'Unhandled Error');

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: err.details || undefined,
    },
    correlationId,
  });
});
