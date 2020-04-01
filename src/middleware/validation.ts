// import { Request, Response, NextFunction, RequestHandler } from 'express';
// import { plainToClass } from 'class-transformer';
// import { validate, ValidationError } from 'class-validator';
// import { RequestValidationError } from '../utils/RequestValidationError';

// export const handleValidation = function validationMiddleware<T>(
//   type: any,
//   skipMissingProperties = false
// ): RequestHandler {
//   return (req: Request, res: Response, next: NextFunction) => {
//     validate(plainToClass(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
//       if (errors.length > 0) {
//         const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
//         next(new RequestValidationError(400, message));
//       } else {
//         next();
//       }
//     });
//   };
// };
