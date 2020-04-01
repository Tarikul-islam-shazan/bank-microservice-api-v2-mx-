import { asyncWrapper } from '../../middleware/asyncWrapper';
import BankAtmController from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { FindAtmParam, FindAtmQuery } from './validators';

export default [
  {
    path: 'v1.0.0/bank/atm/:bankId',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(FindAtmParam, ValidationLevel.Params),
      handleValidation(FindAtmQuery, ValidationLevel.Query),
      asyncWrapper(BankAtmController.getAtmList)
    ]
  }
];
