import { MobileBFFController } from '../../controllers/mobile-bff/mobile-bff';
import { asyncWrapper } from '../../../../middleware/asyncWrapper';
import handleValidation, { ValidationLevel } from '../../../../middleware/validator';
import AuthMiddleware from '../../../../middleware/authMiddleware';
import { Invite, VerifyInvitees, inviteHeader } from '../../validators/invitation/validator';

// These are secure routes
const secureRoutes = [
  {
    path: 'v1.0.0/invitations',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(Invite),
      handleValidation(inviteHeader, ValidationLevel.Headers),
      asyncWrapper(MobileBFFController.invite)
    ]
  },
  {
    path: 'v1.0.0/invitations',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(inviteHeader, ValidationLevel.Headers),
      asyncWrapper(MobileBFFController.list)
    ]
  },
  {
    path: 'v1.0.0/invitations/verify',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(VerifyInvitees),
      asyncWrapper(MobileBFFController.verify)
    ]
  },
  {
    path: 'v1.0.0/logger/ui',
    method: 'post',
    handler: [asyncWrapper(MobileBFFController.UILogger)]
  }
];

// These routes are not secure
const insecureMobile = [
  {
    path: 'v1.0.0/meed/static-data/',
    method: 'get',
    handler: [asyncWrapper(MobileBFFController.getStaticData)]
  }
];

export const bffRoutes = [...insecureMobile, ...secureRoutes];
