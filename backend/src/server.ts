import { app } from './app';
import { env } from './config/env';
import pino from 'pino';

const logger = pino();

function startServer() {
  const server = app.listen(env.PORT, () => {
    logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  const gracefulShutdown = () => {
    logger.info('Received shutdown signal, closing server...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

startServer();