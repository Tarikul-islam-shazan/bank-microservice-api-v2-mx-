import { onboardingRoutes } from './onboarding-routes';
import { bffRoutes } from './mobile-bff';

export const mobileBffRoutes = [...onboardingRoutes, ...bffRoutes];
