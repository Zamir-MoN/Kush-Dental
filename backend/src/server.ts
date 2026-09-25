import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    app.listen(config.server.port, () => {
      logger.info(`Server started on port ${config.server.port} in ${config.server.env} mode.`);
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
