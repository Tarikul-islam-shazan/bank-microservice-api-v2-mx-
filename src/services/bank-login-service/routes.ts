import { asyncWrapper } from '../../middleware/asyncWrapper';
import BankLoginServiceController from './controller';
import { LoginCredentials } from './validators';
import handleValidation from '../../middleware/validator';

export default [
  {
    path: 'v1.0.0/login',
    method: 'post',
    handler: [handleValidation(LoginCredentials), asyncWrapper(BankLoginServiceController.login)]
  }
];
