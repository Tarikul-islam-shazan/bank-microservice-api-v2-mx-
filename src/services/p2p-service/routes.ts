import AuthMiddleware from '../../middleware/authMiddleware';
import P2PTransferServiceController from './controller';
import contactsRoutes from './routes/contacts';
import fundRequestsRoutes from './routes/fundrequests';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { TransferFundHeaders, P2PFundTransferBody } from './validators';

export default [
  ...contactsRoutes,
  ...fundRequestsRoutes,
  {
    path: 'v1.0.0/p2p',
    method: 'post',
    handler: [
      handleValidation(TransferFundHeaders, ValidationLevel.Headers),
      handleValidation(P2PFundTransferBody),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(P2PTransferServiceController.transfer)
    ]
  }
];
