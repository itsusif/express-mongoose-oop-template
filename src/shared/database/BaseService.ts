import { Document } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { AppError } from '../middlewares/errorHandler.middleware';
import { PaginationParams, PaginatedResponse } from '../../types';

/**
 * Base Service class that provides common CRUD operations
 * Extend this class to reduce code duplication in your services
 */
export abstract class BaseService<T extends Document, CreateDTO = any, UpdateDTO = any, ResponseDTO = any> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  /**
   * Get item by ID
   */
  async getById(id: string, errorMessage: string = 'Item not found'): Promise<ResponseDTO> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError(errorMessage, 404);
    }
    return this.mapToDTO(item);
  }

  /**
   * Get all items with pagination
   */
  async getAll(params: PaginationParams, filter: any = {}): Promise<PaginatedResponse<ResponseDTO>> {
    const result = await this.repository.findWithPagination(filter, params);
    return {
      ...result,
      data: result.data.map(item => this.mapToDTO(item)),
    };
  }

  /**
   * Create new item
   */
  async create(data: CreateDTO): Promise<ResponseDTO> {
    const item = await this.repository.create(data as any);
    return this.mapToDTO(item);
  }

  /**
   * Update item by ID
   */
  async update(id: string, data: UpdateDTO, errorMessage: string = 'Item not found'): Promise<ResponseDTO> {
    const item = await this.repository.update(id, data as any);
    if (!item) {
      throw new AppError(errorMessage, 404);
    }
    return this.mapToDTO(item);
  }

  /**
   * Delete item by ID
   */
  async delete(id: string, errorMessage: string = 'Item not found'): Promise<void> {
    const success = await this.repository.delete(id);
    if (!success) {
      throw new AppError(errorMessage, 404);
    }
  }

  /**
   * Soft delete item by ID (if repository supports it)
   */
  async softDelete(id: string, errorMessage: string = 'Item not found'): Promise<void> {
    if ('softDelete' in this.repository && typeof (this.repository as any).softDelete === 'function') {
      const success = await (this.repository as any).softDelete(id);
      if (!success) {
        throw new AppError(errorMessage, 404);
      }
    } else {
      throw new Error('Soft delete not supported by this repository');
    }
  }

  /**
   * Map database document to DTO
   * Override this method in your service to customize the response
   */
  protected abstract mapToDTO(item: T): ResponseDTO;
}
