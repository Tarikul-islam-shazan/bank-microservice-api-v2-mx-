import { Request } from 'express';

export interface IValidatedRequest<T> extends Request {
  transformedType?: T;
}
