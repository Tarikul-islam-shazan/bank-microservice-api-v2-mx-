import { Request, Router, Response, NextFunction } from 'express';
import config from '../config/config';

type Wrapper = (router: Router) => void;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

interface Route {
  path: string;
  method: string;
  handler: Handler | Handler[];
}

export const applyRoutes = (routes: Route[], router: Router) => {
  const url = config.app.baseUrl;
  for (const route of routes) {
    const { method, path, handler } = route;
    (router as any)[method](url + path, handler);
  }
};
