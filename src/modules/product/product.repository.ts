import { BaseRepository } from '../../shared/database/BaseRepository';
import { ProductModel, IProduct } from '../../shared/database/models/Product.model';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }

  async findByCategory(category: string): Promise<IProduct[]> {
    return await this.model.find({ category, isActive: true }).exec();
  }

  async searchProducts(searchTerm: string): Promise<IProduct[]> {
    return await this.model
      .find({
        $text: { $search: searchTerm },
        isActive: true,
      })
      .exec();
  }

  async findActiveProducts(): Promise<IProduct[]> {
    return await this.model.find({ isActive: true }).exec();
  }
}
