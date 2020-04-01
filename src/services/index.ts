import meedServiceRoutes from './meedservice/routes';
import verificationRoutes from './verification/routes';
import bankOnboardingRoutes from './bank-onboarding/routes';
import accountServiceRoutes from './account-service/routes';
import urbanAirshipServiceRoutes from './urban-airship-service/routes';
import transferRoutes from './internal-transfer/routes';
import bankLoginRoutes from './bank-login-service/routes';
import cardServiceRoutes from './card-service/routes';
import affinityServiceRoutes from './affinity-service/routes';
import customerServiceRoutes from './customer-service/routes';
import meedShareRoutes from './meed-share/routes';
import bankAtmRoutes from './bank-atm/routes';
import savingsRoutes from './savings-goals/routes';
import virtualAssistantRoutes from './virtual-assistant/routes';
import depositServiceRoutes from './deposit-service/routes';
import bankCredentialServiceRoutes from './bank-credential-service/routes';
import jumioServiceRoutes from './jumio-service/routes';
import p2pServiceRoutes from './p2p-service/routes';
import billPayRoutes from './bill-pay-service/routes';
import promotionRoutes from './promotion-service/routes';

export default [
  ...meedServiceRoutes,
  ...verificationRoutes,
  ...accountServiceRoutes,
  ...bankOnboardingRoutes,
  ...transferRoutes,
  ...bankLoginRoutes,
  ...urbanAirshipServiceRoutes,
  ...affinityServiceRoutes,
  ...customerServiceRoutes,
  ...meedShareRoutes,
  ...bankAtmRoutes,
  ...cardServiceRoutes,
  ...savingsRoutes,
  ...virtualAssistantRoutes,
  ...depositServiceRoutes,
  ...bankCredentialServiceRoutes,
  ...jumioServiceRoutes,
  ...p2pServiceRoutes,
  ...billPayRoutes,
  ...promotionRoutes
];
