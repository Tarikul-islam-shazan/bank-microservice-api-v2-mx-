import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../utils/httpErrors';
import HttpStatus from 'http-status-codes';

/**
 * We can validate the joi validation against request body/query/headers
 * This will select one of them. Default is request body
 *
 * @export
 * @enum {number}
 */
export enum ValidationLevel {
  Body = 'body',
  Query = 'query',
  Params = 'params',
  Headers = 'headers'
}

const handleValidation = function validationMiddleware(
  schema: any,
  property: ValidationLevel = ValidationLevel.Body,
  isOptional: boolean = false
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (property === ValidationLevel.Query) {
        if (Object.keys(req.query).length || !isOptional) {
          await schema.validateAsync(req.query);
        } else {
          return next();
        }
      } else if (property === ValidationLevel.Params) {
        await schema.validateAsync(req.params);
      } else if (property === ValidationLevel.Headers) {
        // headers may contain a numbers of property like user-agent, accept, accept-encoding.
        // So we are allowing unknown but ensuring required one with schema
        await schema.validateAsync(req.headers, { allowUnknown: true });
      } else {
        await schema.validateAsync(req.body);
      }
      next();
    } catch (error) {
      const { details } = error;
      const message = details.map((err: any) => err.message).join(',');
      next(new HTTPError(message, '4000', HttpStatus.BAD_REQUEST));
    }
  };
};

export default handleValidation;
