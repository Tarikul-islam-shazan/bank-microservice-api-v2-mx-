import { asyncWrapper } from '../../middleware/asyncWrapper';
import CardServiceController from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { validateCardParams } from './validators';

export default [
  {
    path: 'v1.0.0/cards/:customerId',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(CardServiceController.cardDetails)]
  },
  {
    path: 'v1.0.0/cards/:cardId/:state',
    method: 'patch',
    handler: [
      handleValidation(validateCardParams, ValidationLevel.Params),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(CardServiceController.updateCardState)
    ]
  }
];
