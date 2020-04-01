import { asyncWrapper } from '../../middleware/asyncWrapper';
import AccountSerivceController from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { TransactionQueryValidate, SweepsHeader, SweepStates } from './validators';

export default [
  {
    path: 'v1.0.0/bank/accounts',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(AccountSerivceController.accountSummary)]
  },
  {
    path: 'v1.0.0/bank/accounts/:accountId/transactions',
    method: 'get',
    handler: [
      handleValidation(TransactionQueryValidate, ValidationLevel.Query, true),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(AccountSerivceController.getTransactions)
    ]
  },
  {
    path: 'v1.0.0/accounts/:accountId/statements',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(AccountSerivceController.statements)]
  },
  {
    path: 'v1.0.0/accounts/:accountId/statements/:statementId',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(AccountSerivceController.statementDetails)]
  },
  {
    path: 'v1.0.0/accounts/sweeps',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(SweepsHeader, ValidationLevel.Headers),
      asyncWrapper(AccountSerivceController.sweepState)
    ]
  },
  {
    path: 'v1.0.0/accounts/sweeps',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(SweepsHeader, ValidationLevel.Headers),
      handleValidation(SweepStates, ValidationLevel.Body),
      asyncWrapper(AccountSerivceController.updateSweepState)
    ]
  }
];
