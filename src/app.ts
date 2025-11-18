import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { Config } from './shared/config';
import { swaggerSpec } from './shared/config/swagger';
import { ErrorHandlerMiddleware } from './shared/middlewares/errorHandler.middleware';
import { ResponseHandlerMiddleware } from './shared/middlewares/responseHandler.middleware';
import { CorrelationIdMiddleware } from './shared/middlewares/correlationId.middleware';
import { RateLimiterMiddleware } from './shared/middlewares/rateLimiter.middleware';
import { HealthCheck } from './shared/utils/healthCheck';
import { AuthRoutes } from './modules/auth/auth.routes';
import { UserRoutes } from './modules/user/user.routes';
import { ProductRoutes } from './modules/product/product.routes';

export class App {
  public app: Application;
  private authRoutes: AuthRoutes;
  private userRoutes: UserRoutes;
  private productRoutes: ProductRoutes;

  constructor() {
    this.app = express();
    this.authRoutes = new AuthRoutes();
    this.userRoutes = new UserRoutes();
    this.productRoutes = new ProductRoutes();
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Enhance response with custom methods (must be first)
    this.app.use(ResponseHandlerMiddleware.enhanceResponse);

    // Add correlation ID to track requests
    this.app.use(CorrelationIdMiddleware.addCorrelationId);

    // CORS middleware
    this.app.use(cors({
      origin: Config.CORS_ORIGIN,
      credentials: true,
    }));
    
    // Security middleware
    this.app.use(helmet());
    
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Compression middleware
    this.app.use(compression());
    
    // Logging middleware
    if (Config.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Global rate limiting
    this.app.use('/api/', RateLimiterMiddleware.general);
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Get detailed health status
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Service health information
     */
    this.app.get('/health', async (req, res, next) => {
      try {
        const health = await HealthCheck.getHealth();
        res.sendSuccess(health, 'Health check completed');
      } catch (error) {
        next(error);
      }
    });

    // Liveness probe - simple check if server is running
    this.app.get('/health/live', async (req, res) => {
      const isAlive = await HealthCheck.isAlive();
      if (isAlive) {
        res.sendSuccess({ status: 'alive' }, 'Service is alive');
      } else {
        res.sendError('Service is not responding', 503);
      }
    });

    // Readiness probe - check if server is ready to accept traffic
    this.app.get('/health/ready', async (req, res) => {
      const isReady = await HealthCheck.isReady();
      if (isReady) {
        res.sendSuccess({ status: 'ready' }, 'Service is ready');
      } else {
        res.sendError('Service is not ready', 503);
      }
    });

    // Swagger API documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Express Mongoose OOP API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
    }));

    // Serve uploaded files
    this.app.use('/uploads', express.static('uploads'));

    // API routes
    this.app.use('/api/auth', this.authRoutes.getRouter());
    this.app.use('/api/users', this.userRoutes.getRouter());
    this.app.use('/api/products', this.productRoutes.getRouter());

    // 404 handler
    this.app.use(ErrorHandlerMiddleware.notFound);
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorHandlerMiddleware.handle);
  }

  public getApp(): Application {
    return this.app;
  }
}
