import { Document, Model, FilterQuery, SortOrder } from 'mongoose';

/**
 * Query Builder for complex MongoDB queries
 * Provides a fluent interface for building queries
 */
export class QueryBuilder<T extends Document> {
  private model: Model<T>;
  private query: FilterQuery<T> = {};
  private sortOptions: { [key: string]: SortOrder } = {};
  private selectFields: string = '';
  private populateOptions: any[] = [];
  private limitValue: number = 0;
  private skipValue: number = 0;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Add filter conditions
   */
  filter(conditions: FilterQuery<T>): this {
    this.query = { ...this.query, ...conditions };
    return this;
  }

  /**
   * Add where clause
   */
  where(field: string, value: any): this {
    this.query[field as keyof FilterQuery<T>] = value as any;
    return this;
  }

  /**
   * Add $in operator
   */
  whereIn(field: string, values: any[]): this {
    this.query[field as keyof FilterQuery<T>] = { $in: values } as any;
    return this;
  }

  /**
   * Add $nin operator (not in)
   */
  whereNotIn(field: string, values: any[]): this {
    this.query[field as keyof FilterQuery<T>] = { $nin: values } as any;
    return this;
  }

  /**
   * Add greater than condition
   */
  greaterThan(field: string, value: any): this {
    this.query[field as keyof FilterQuery<T>] = { $gt: value } as any;
    return this;
  }

  /**
   * Add less than condition
   */
  lessThan(field: string, value: any): this {
    this.query[field as keyof FilterQuery<T>] = { $lt: value } as any;
    return this;
  }

  /**
   * Add date range filter
   */
  dateBetween(field: string, startDate: Date, endDate: Date): this {
    this.query[field as keyof FilterQuery<T>] = {
      $gte: startDate,
      $lte: endDate,
    } as any;
    return this;
  }

  /**
   * Add text search
   */
  search(searchTerm: string): this {
    this.query.$text = { $search: searchTerm } as any;
    return this;
  }

  /**
   * Sort by field
   */
  sort(field: string, order: 'asc' | 'desc' = 'asc'): this {
    this.sortOptions[field] = order === 'asc' ? 1 : -1;
    return this;
  }

  /**
   * Select specific fields
   */
  select(fields: string): this {
    this.selectFields = fields;
    return this;
  }

  /**
   * Populate related documents
   */
  populate(path: string, select?: string): this {
    this.populateOptions.push({ path, select });
    return this;
  }

  /**
   * Limit results
   */
  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  /**
   * Skip results (for pagination)
   */
  skip(skip: number): this {
    this.skipValue = skip;
    return this;
  }

  /**
   * Paginate results
   */
  paginate(page: number, perPage: number): this {
    this.limitValue = perPage;
    this.skipValue = (page - 1) * perPage;
    return this;
  }

  /**
   * Execute query and return results
   */
  async execute(): Promise<T[]> {
    let query = this.model.find(this.query);

    if (Object.keys(this.sortOptions).length > 0) {
      query = query.sort(this.sortOptions);
    }

    if (this.selectFields) {
      query = query.select(this.selectFields);
    }

    if (this.populateOptions.length > 0) {
      this.populateOptions.forEach(pop => {
        query = query.populate(pop);
      });
    }

    if (this.skipValue > 0) {
      query = query.skip(this.skipValue);
    }

    if (this.limitValue > 0) {
      query = query.limit(this.limitValue);
    }

    return await query.exec();
  }

  /**
   * Execute query and return first result
   */
  async first(): Promise<T | null> {
    let query = this.model.findOne(this.query);

    if (Object.keys(this.sortOptions).length > 0) {
      query = query.sort(this.sortOptions);
    }

    if (this.selectFields) {
      query = query.select(this.selectFields);
    }

    if (this.populateOptions.length > 0) {
      this.populateOptions.forEach(pop => {
        query = query.populate(pop);
      });
    }

    return await query.exec();
  }

  /**
   * Count matching documents
   */
  async count(): Promise<number> {
    return await this.model.countDocuments(this.query).exec();
  }

  /**
   * Check if any documents match
   */
  async exists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}
