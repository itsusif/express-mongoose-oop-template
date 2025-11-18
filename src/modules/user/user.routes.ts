import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from './user.controller';
import { AuthMiddleware } from '../../shared/middlewares/auth.middleware';
import { ValidationMiddleware } from '../../shared/middlewares/validation.middleware';

export class UserRoutes {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Update profile validation
    const updateValidation = [
      body('name').optional().notEmpty().withMessage('Name cannot be empty'),
      body('email').optional().isEmail().withMessage('Valid email is required'),
    ];

    /**
     * @swagger
     * /api/users/profile:
     *   get:
     *     summary: Get current user profile
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Profile retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized
     */
    this.router.get(
      '/profile',
      AuthMiddleware.authenticate,
      this.userController.getProfile
    );

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users (with pagination)
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Number of items per page
     *     responses:
     *       200:
     *         description: Users retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     *                 pagination:
     *                   $ref: '#/components/schemas/Pagination'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.get(
      '/',
      AuthMiddleware.authenticate,
      this.userController.getAllUsers
    );


    /**
     * @swagger
     * /api/users/profile:
     *   put:
     *     summary: Update current user profile
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *     responses:
     *       200:
     *         description: Profile updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.put(
      '/profile',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(updateValidation),
      this.userController.updateProfile
    );

    /**
     * @swagger
     * /api/users/:id:
     *   delete:
     *     summary: Delete user (admin only)
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: User not found
     */
    this.router.delete(
      '/:id',
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize('admin'),
      this.userController.deleteUser
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
