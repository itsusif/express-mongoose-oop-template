import { AppError } from '../../shared/middlewares/errorHandler.middleware';
import { PaginationParams } from '../../types';
import { ProductRepository } from './product.repository';
import { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from './product.types';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(userId: string, data: CreateProductDTO): Promise<ProductResponseDTO> {
    const productData: any = {
      ...data,
      createdBy: userId,
    };

    const product = await this.productRepository.create(productData);
    return this.mapToDTO(product);
  }

  async getProductById(productId: string): Promise<ProductResponseDTO> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return this.mapToDTO(product);
  }

  async getAllProducts(params: PaginationParams) {
    const result = await this.productRepository.findWithPagination(
      { isActive: true },
      params
    );
    return {
      ...result,
      data: result.data.map(product => this.mapToDTO(product)),
    };
  }

  async getProductsByCategory(category: string, params: PaginationParams) {
    const result = await this.productRepository.findWithPagination(
      { category, isActive: true },
      params
    );
    return {
      ...result,
      data: result.data.map(product => this.mapToDTO(product)),
    };
  }

  async searchProducts(searchTerm: string): Promise<ProductResponseDTO[]> {
    const products = await this.productRepository.searchProducts(searchTerm);
    return products.map(product => this.mapToDTO(product));
  }

  async updateProduct(
    productId: string,
    userId: string,
    data: UpdateProductDTO
  ): Promise<ProductResponseDTO> {
    // Check if product exists and user owns it
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    if (existingProduct.createdBy.toString() !== userId) {
      throw new AppError('Unauthorized to update this product', 403);
    }

    const product = await this.productRepository.update(productId, data);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return this.mapToDTO(product);
  }

  async deleteProduct(productId: string, userId: string): Promise<void> {
    // Check if product exists and user owns it
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    if (existingProduct.createdBy.toString() !== userId) {
      throw new AppError('Unauthorized to delete this product', 403);
    }

    const success = await this.productRepository.delete(productId);
    if (!success) {
      throw new AppError('Failed to delete product', 500);
    }
  }

  private mapToDTO(product: any): ProductResponseDTO {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images,
      isActive: product.isActive,
      createdBy: product.createdBy.toString(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
