import { asyncWrapper } from '../../middleware/asyncWrapper';
import MeedShareController from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { MeedShareGetStatistics } from './validators';

export default [
  {
    path: 'v1.0.0/meedshare',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(MeedShareGetStatistics, ValidationLevel.Query),
      asyncWrapper(MeedShareController.getMeedShareStatistics)
    ]
  }
];
