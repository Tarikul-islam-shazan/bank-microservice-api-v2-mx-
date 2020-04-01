import { asyncWrapper } from '../../middleware/asyncWrapper';
import BankCredentialController from './controller';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import {
  ForgotUsername,
  GetChallengeQuestions,
  ValidateChallengeQuestions,
  ResetPassword,
  ChangePassword
} from './validators';
import AuthMiddleware from '../../middleware/authMiddleware';

export default [
  {
    path: 'v1.0.0/credentials/forgot-username',
    method: 'post',
    handler: [
      handleValidation(ForgotUsername, ValidationLevel.Body),
      asyncWrapper(BankCredentialController.forgotUsername)
    ]
  },
  {
    path: 'v1.0.0/credentials/forgot-password/challenge-questions',
    method: 'get',
    handler: [
      handleValidation(GetChallengeQuestions, ValidationLevel.Query),
      asyncWrapper(BankCredentialController.getChallengeQuestions)
    ]
  },
  {
    path: 'v1.0.0/credentials/forgot-password/challenge-questions',
    method: 'post',
    handler: [
      handleValidation(ValidateChallengeQuestions, ValidationLevel.Body),
      asyncWrapper(BankCredentialController.validateChallengeQuestions)
    ]
  },
  {
    path: 'v1.0.0/credentials/forgot-password/reset',
    method: 'post',
    handler: [
      handleValidation(ResetPassword, ValidationLevel.Body),
      asyncWrapper(BankCredentialController.resetPassword)
    ]
  },
  {
    path: 'v1.0.0/credentials/change-password',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(ChangePassword, ValidationLevel.Body),
      asyncWrapper(BankCredentialController.changePassword)
    ]
  }
];
