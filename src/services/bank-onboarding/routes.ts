import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { asyncWrapper } from '../../middleware/asyncWrapper';
import {
  MemberIdRequired,
  CreateLogin,
  AcceptTermsAndCondition,
  IdentityQuestionAnswers,
  RegistrationFee,
  GeneralInfo,
  SignupAddressInfo
} from './validators';
import { OnboardingController } from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';

export default [
  {
    path: 'v1.0.0/bank/onboarding/create-login',
    method: 'post',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(CreateLogin),
      asyncWrapper(OnboardingController.createLogin)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/apply/general-info',
    method: 'post',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(GeneralInfo),
      asyncWrapper(OnboardingController.generalInformation)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/apply/address-info',
    method: 'post',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(SignupAddressInfo),
      asyncWrapper(OnboardingController.addressInfo)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/identity-questions',
    method: 'get',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(OnboardingController.getIdentityQuestions)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/identity-questions',
    method: 'post',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(IdentityQuestionAnswers),
      asyncWrapper(OnboardingController.setIdentityQuestionsAnswers)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/terms-and-conditions',
    method: 'get',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      asyncWrapper(OnboardingController.getTermsAndCondition)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/terms-and-conditions',
    method: 'post',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(AcceptTermsAndCondition),
      asyncWrapper(OnboardingController.acceptTermsAndConditions)
    ]
  },
  {
    path: 'v1.0.0/bank/onboarding/registration-fee',
    method: 'post',
    handler: [
      handleValidation(MemberIdRequired, ValidationLevel.Headers),
      handleValidation(RegistrationFee),
      asyncWrapper(OnboardingController.fundAccount)
    ]
  }
];
