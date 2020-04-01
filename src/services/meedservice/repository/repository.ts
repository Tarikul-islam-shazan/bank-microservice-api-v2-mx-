import mongoose, { Document } from 'mongoose';

export class BaseRepository<K, T extends Document> implements RepositoryInterface<K, T> {
  public model: mongoose.Model<T>;

  constructor(schemaModel: mongoose.Model<T>) {
    this.model = schemaModel;
  }

  async create(item: K): Promise<T> {
    return await new this.model(item).save();
  }

  async findByIdAndUpdate(_id: string, item: K): Promise<T | null> {
    return this.model
      .findByIdAndUpdate({ _id }, item, { new: true, projection: { __v: 0 } })
      .lean()
      .exec();
  }

  async delete(_id: string): Promise<boolean> {
    const count = await this.model.deleteMany({ _id }).exec();
    return count > 0;
  }

  async findById(_id: string, populates: any = []): Promise<T | null> {
    return this.model.findById({ _id }).populate(populates);
  }

  async findOneAndUpdate(filter: any, update: any, options: any): Promise<T | null> {
    const result = await this.model.findOneAndUpdate(filter, update, options).exec();
    return result;
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

  async findOne(condition: any, projection?: any, populates?: any): Promise<T | null> {
    return await this.model
      .findOne(condition, projection)
      .populate(populates)
      .exec();
  }
}

export interface RepositoryInterface<K, T> {
  create(item: K): Promise<T>;
  findByIdAndUpdate(id: string, item: K): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  find(condition: any, projection: any, sort: any, limit: number, page: number): Promise<T[]>;
  findOne(condition: any, projection: any, populates: any): Promise<T | null>;
  findOneAndUpdate(filter: any, query: any, options: any): Promise<T | null>;
}
