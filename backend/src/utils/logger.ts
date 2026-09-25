import pino from 'pino';
import { config } from '../config/index.js';

const transport = config.server.env === 'development' || config.server.env === 'test'
  ? { target: 'pino-pretty', options: { colorize: true } }
  : undefined;

export const logger = pino({
  level: config.logging.level,
  transport,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
