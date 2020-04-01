import { Request, Response, NextFunction, Router } from 'express';
import * as ErrorHandler from '../utils/ErrorHandler';
import httpContext from 'express-http-context';

const handle404Error = (router: Router) => {
  router.use((req: Request, res: Response) => {
    ErrorHandler.notFoundError();
  });
};

const errorLogger = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const context = httpContext.get('loggingContext');

    httpContext.set('loggingContext', { ...context, isError: true, errorMessage: err.message, stackTrace: err.stack });
    next(err);
  });
};

const handleClientError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.clientError(err, res, next);
  });
};

const handleServerError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.serverError(err, res, next);
  });
};

export default [handle404Error, errorLogger, handleClientError, handleServerError];
