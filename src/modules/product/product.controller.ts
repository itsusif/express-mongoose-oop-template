import { Response, NextFunction } from 'express';
import { AuthRequest, PaginationParams } from '../../types';
import { ProductService } from './product.service';
import { CreateProductDTO, UpdateProductDTO } from './product.types';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: CreateProductDTO = req.body;
      const result = await this.productService.createProduct(userId, data);
      res.sendCreated(result, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const result = await this.productService.getProductById(productId);
      res.sendSuccess(result, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sort: req.query.sort as string,
        order: req.query.order as 'asc' | 'desc',
      };
      const result = await this.productService.getAllProducts(params);
      res.sendSuccess(result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getProductsByCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = req.params.category;
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sort: req.query.sort as string,
        order: req.query.order as 'asc' | 'desc',
      };
      const result = await this.productService.getProductsByCategory(category, params);
      res.sendSuccess(result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm) {
        res.sendError('Search term is required', 400);
        return;
      }
      const result = await this.productService.searchProducts(searchTerm);
      res.sendSuccess(result, 'Search completed successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const userId = req.user!.id;
      const data: UpdateProductDTO = req.body;
      const result = await this.productService.updateProduct(productId, userId, data);
      res.sendSuccess(result, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const userId = req.user!.id;
      await this.productService.deleteProduct(productId, userId);
      res.sendNoContent();
    } catch (error) {
      next(error);
    }
  };
}
