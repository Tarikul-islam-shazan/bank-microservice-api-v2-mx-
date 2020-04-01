import { VerificationController } from './controller';
import handleValidation from '../../middleware/validator';
import { VerifyEmailCode, CreateVerificationCode } from './validators/email-verification';
import { asyncWrapper } from '../../middleware/asyncWrapper';

export default [
  {
    path: 'v1.0.0/verification',
    method: 'post',
    handler: [handleValidation(CreateVerificationCode), asyncWrapper(VerificationController.createVerificationCode)]
  },
  {
    path: 'v1.0.0/verification',
    method: 'patch',
    handler: [handleValidation(VerifyEmailCode), asyncWrapper(VerificationController.verifyEmailCode)]
  }
];
