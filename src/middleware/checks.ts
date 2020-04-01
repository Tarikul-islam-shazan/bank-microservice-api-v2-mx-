import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../utils/httpErrors';
import HttpStatus from 'http-status-codes';

export const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.q) {
    throw new HTTPError('Missing q parameter', String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
  } else {
    next();
  }
};
