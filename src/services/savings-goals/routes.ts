import { SavingsGoalsController } from './controller';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { MemberIdRequired, SaveSavingsGoals, UpdateSavingsGoals } from './validators';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import AuthMiddleware from '../../middleware/authMiddleware';

export default [
  {
    path: 'v1.0.0/savings-goals',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      asyncWrapper(SavingsGoalsController.getSavingsGoals)
    ]
  },
  {
    path: 'v1.0.0/savings-goals',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(SaveSavingsGoals),
      asyncWrapper(SavingsGoalsController.saveSavingsGoals)
    ]
  },
  {
    path: 'v1.0.0/savings-goals/:id',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(UpdateSavingsGoals),
      asyncWrapper(SavingsGoalsController.updateSavingsGoals)
    ]
  },
  {
    path: 'v1.0.0/savings-goals/:id',
    method: 'delete',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      asyncWrapper(SavingsGoalsController.deleteSavingsGoals)
    ]
  }
];
