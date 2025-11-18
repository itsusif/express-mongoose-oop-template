import 'reflect-metadata';
import { App } from './app';
import { Config } from './shared/config';
import { Database } from './shared/database';
import { Logger } from './shared/utils/logger';
import winston from 'winston';

class Server {
  private app: App;
  private database: Database;
  private logger: winston.Logger;

  constructor() {
    this.app = new App();
    this.database = Database.getInstance();
    this.logger = Logger.getInstance();
  }

  public async start(): Promise<void> {
    try {
      // Validate configuration
      Config.validate();

      // Connect to database
      await this.database.connect();

      // Start server
      const server = this.app.getApp().listen(Config.PORT, () => {
        this.logger.info(`🚀 Server started on port ${Config.PORT}`);
        this.logger.info(`📝 Environment: ${Config.NODE_ENV}`);
        this.logger.info(`🔗 Health check: http://localhost:${Config.PORT}/health`);
      });

      // Graceful shutdown
      this.setupGracefulShutdown(server);

    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(server: import('http').Server): void {
    const gracefulShutdown = async (signal: string) => {
      this.logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        this.logger.info('HTTP server closed');
        
        await this.database.disconnect();
        
        this.logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        this.logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
}

// Start the server
const server = new Server();
server.start();
