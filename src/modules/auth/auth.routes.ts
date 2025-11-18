import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from './auth.controller';
import { ValidationMiddleware } from '../../shared/middlewares/validation.middleware';
import { RateLimiterMiddleware } from '../../shared/middlewares/rateLimiter.middleware';

export class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Register validation
    const registerValidation = [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
      body('name').notEmpty().withMessage('Name is required'),
    ];

    // Login validation
    const loginValidation = [
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ];

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *               - name
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Validation error
     *       409:
     *         description: Email already exists
     */
    this.router.post(
      '/register',
      RateLimiterMiddleware.strict,
      ValidationMiddleware.validate(registerValidation),
      this.authController.register
    );

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Login user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       401:
     *         description: Invalid credentials
     */
    this.router.post(
      '/login',
      RateLimiterMiddleware.strict,
      ValidationMiddleware.validate(loginValidation),
      this.authController.login
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}