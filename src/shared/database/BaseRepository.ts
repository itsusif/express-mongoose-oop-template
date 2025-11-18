import { Document, Model, FilterQuery } from 'mongoose';
import { IBaseRepository, PaginationParams, PaginatedResponse } from '../../types';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      throw new Error(`Error finding document by id: ${error}`);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error) {
      throw new Error(`Error finding document: ${error}`);
    }
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    try {
      return await this.model.find(filter).exec();
    } catch (error) {
      throw new Error(`Error finding documents: ${error}`);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw new Error(`Error creating document: ${error}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .exec();
    } catch (error) {
      throw new Error(`Error updating document: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting document: ${error}`);
    }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      const result = await this.model
        .findByIdAndUpdate(id, { deletedAt: new Date(), isDeleted: true }, { new: true })
        .exec();
      return !!result;
    } catch (error) {
      throw new Error(`Error soft deleting document: ${error}`);
    }
  }

  async restore(id: string): Promise<boolean> {
    try {
      const result = await this.model
        .findByIdAndUpdate(id, { $unset: { deletedAt: 1 }, isDeleted: false }, { new: true })
        .exec();
      return !!result;
    } catch (error) {
      throw new Error(`Error restoring document: ${error}`);
    }
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    try {
      return await this.model.countDocuments(filter).exec();
    } catch (error) {
      throw new Error(`Error counting documents: ${error}`);
    }
  }

  async findWithPagination(
    filter: FilterQuery<T>,
    params: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const skip = (page - 1) * limit;
      const sort = params.sort || 'createdAt';
      const order = params.order === 'asc' ? 1 : -1;

      const [data, total] = await Promise.all([
        this.model
          .find(filter)
          .sort({ [sort]: order })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.model.countDocuments(filter).exec(),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding documents with pagination: ${error}`);
    }
  }
}