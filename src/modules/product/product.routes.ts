import { Router } from 'express';
import { body } from 'express-validator';
import { ProductController } from './product.controller';
import { AuthMiddleware } from '../../shared/middlewares/auth.middleware';
import { ValidationMiddleware } from '../../shared/middlewares/validation.middleware';

export class ProductRoutes {
  public router: Router;
  private productController: ProductController;

  constructor() {
    this.router = Router();
    this.productController = new ProductController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create product validation
    const createValidation = [
      body('name').notEmpty().withMessage('Name is required'),
      body('description').notEmpty().withMessage('Description is required'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('category')
        .isIn(['electronics', 'clothing', 'food', 'books', 'other'])
        .withMessage('Invalid category'),
      body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    ];

    // Update product validation
    const updateValidation = [
      body('name').optional().notEmpty().withMessage('Name cannot be empty'),
      body('description').optional().notEmpty().withMessage('Description cannot be empty'),
      body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('category')
        .optional()
        .isIn(['electronics', 'clothing', 'food', 'books', 'other'])
        .withMessage('Invalid category'),
      body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    ];


    /**
     * @swagger
     * /api/products:
     *   post:
     *     summary: Create a new product
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Product'
     *     responses:
     *       201:
     *         description: Product created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Product'
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    this.router.post(
      '/',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(createValidation),
      this.productController.createProduct
    );

    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Get all products (with pagination)
     *     tags: [Products]
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
     *           default: 10
     *         description: Number of items per page
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *         description: Field to sort by (e.g. "price", "createdAt")
     *       - in: query
     *         name: order
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: asc
     *         description: Sort order
     *     responses:
     *       200:
     *         description: Products retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/Success'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: object
     *                       properties:
     *                         data:
     *                           type: array
     *                           items:
     *                             $ref: '#/components/schemas/Product'
     *                         pagination:
     *                           $ref: '#/components/schemas/Pagination'
     */
    this.router.get('/', this.productController.getAllProducts);

    /**
     * @swagger
     * /api/products/search:
     *   get:
     *     summary: Search products
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: q
     *         required: true
     *         schema:
     *           type: string
     *         description: Search term to filter products by name or description
     *     responses:
     *       200:
     *         description: Products matching search term retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/Success'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Product'
     *       400:
     *         description: Missing or invalid search term
     */
    this.router.get('/search', this.productController.searchProducts);

    /**
     * @swagger
     * /api/products/category/{category}:
     *   get:
     *     summary: Get products by category (with pagination)
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: category
     *         required: true
     *         schema:
     *           type: string
     *           enum: [electronics, clothing, food, books, other]
     *         description: Product category to filter by
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
     *       - in: query
     *         name: sort
     *         schema:
     *           type: string
     *         description: Field to sort by (e.g., price, createdAt)
     *       - in: query
     *         name: order
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *           default: asc
     *         description: Sort order
     *     responses:
     *       200:
     *         description: Products retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/Success'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         $ref: '#/components/schemas/Product'
     *                     pagination:
     *                       $ref: '#/components/schemas/Pagination'
     */
    this.router.get('/category/:category', this.productController.getProductsByCategory);

    /**
     * @swagger
     * /api/products/{id}:
     *   get:
     *     summary: Get product by ID
     *     tags: [Products]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/Success'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Product'
     *       404:
     *         description: Product not found
     */
    this.router.get('/:id', this.productController.getProductById);

    /**
     * @swagger
     * /api/products/{id}:
     *   put:
     *     summary: Update product
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateProductDTO'
     *     responses:
     *       200:
     *         description: Product updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               allOf:
     *                 - $ref: '#/components/schemas/Success'
     *                 - type: object
     *                   properties:
     *                     data:
     *                       $ref: '#/components/schemas/Product'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the product owner
     *       404:
     *         description: Product not found
     */
    this.router.put(
      '/:id',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(updateValidation),
      this.productController.updateProduct
    );
    
    /**
     * @swagger
     * /api/products/{id}:
     *   delete:
     *     summary: Delete product
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       204:
     *         description: Product deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - not the product owner
     *       404:
     *         description: Product not found
     */
    this.router.delete(
      '/:id',
      AuthMiddleware.authenticate,
      this.productController.deleteProduct
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
