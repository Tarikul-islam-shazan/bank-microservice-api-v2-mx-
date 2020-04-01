import { PromotionController } from './controller';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { MemberIdRequired } from './validators';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import AuthMiddleware from '../../middleware/authMiddleware';

export default [
  {
    path: 'v1.0.0/promotions/:memberId',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(PromotionController.getPromotion)]
  }
];
