import mongoose, { Document } from 'mongoose';

export class BaseRepository<K, T extends Document> implements RepositoryInterface<K, T> {
  public model: mongoose.Model<T>;

  constructor(schemaModel: mongoose.Model<T>) {
    this.model = schemaModel;
  }

  async create(item: K): Promise<T> {
    return await this.model.create(item);
  }

  async findByIdAndUpdate(id: string, item: K): Promise<T | null> {
    return this.model.findByIdAndUpdate({ _id: id }, item, { new: true, projection: { __v: 0 } }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.model.deleteMany({ _id: id }).exec();
    return count > 0;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById({ id });
  }

  async find(condition: any, projection?: any, sort?: any, limit?: number, page?: number): Promise<T[]> {
    const query = this.model.find(condition, projection);
    if (sort) {
      query.sort(sort);
    }
    if (limit) {
      query.limit(limit);
    }
    if (page) {
      query.skip(page);
    }
    return await query.exec();
  }

  async findOne(condition: any): Promise<T | null> {
    return await this.model.findOne(condition).exec();
  }
}

export interface RepositoryInterface<K, T> {
  create(item: K): Promise<T>;
  findByIdAndUpdate(id: string, item: K): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  find(condition: any, projection: any, sort: any, limit: number, page: number): Promise<T[]>;
  findOne(condition: any, populates?: any): Promise<T | null>;
}
