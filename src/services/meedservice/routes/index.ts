import { countryRoutes } from './country-routes';
import { memberRoutes } from './member-routes';
import { mobileBffRoutes } from './mobile-bff/';
import { healthRoute } from './health-route';
import { appVersionRoutes } from './app-version-route';

export const subModuleRoutes = [
  ...mobileBffRoutes,
  ...countryRoutes,
  ...memberRoutes,
  healthRoute,
  ...appVersionRoutes
];
