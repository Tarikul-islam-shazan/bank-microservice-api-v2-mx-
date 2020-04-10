import { NextFunction, Response, Request } from 'express';
import config from '../../../config/config';
const random = Math.floor(Math.random() * 10000);

export const healthRoute = {
  path: 'v1.0.0/health',
  method: 'get',
  handler: [
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      res.status(200).send(`${config.app.title} mx server ${random} is healthy!`);
    }
  ]
};
