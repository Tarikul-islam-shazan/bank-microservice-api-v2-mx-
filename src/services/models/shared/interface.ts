import { IAuthorization } from '../../bank-auth/models/interface';

export interface IBankService {
  setAuthorizationService(auth: IAuthorization): void;
  getAuthorizationService(): IAuthorization;
}

export interface RepositoryInterface<K, T> {
  create(item: K): Promise<T>;
  findByIdAndUpdate(id: string, item: K): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  find(condition: any, projection: any, sort: any, limit: number, page: number): Promise<T[]>;
  findOne(condition: any, projection: any): Promise<T | null>;
  findOneAndUpdate(filter: any, query: any, options: any): Promise<T | null>;
}
