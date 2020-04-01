import { NextFunction, Response, Request } from 'express';
import config from '../../../config/config';

export const healthRoute = {
  path: 'v1.0.0/health',
  method: 'get',
  handler: [
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.status(200).send(`${config.app.title} is healthy!`);
    }
  ]
};
