import { asyncWrapper } from '../../../../middleware/asyncWrapper';
import { MeedOnboardingController } from '../../controllers/mobile-bff/onboarding-controller';
import handleValidation, { ValidationLevel } from '../../../../middleware/validator';
import { SignUpEmail, Onboarding, ValidateInviter } from '../../validators/onboarding/validator';

export const onboardingRoutes = [
  //#region MeedOnboarding
  {
    path: 'v1.0.0/meed/onboarding/',
    method: 'post',
    handler: [handleValidation(SignUpEmail), asyncWrapper(MeedOnboardingController.createOnboarding)]
  },
  {
    path: 'v1.0.0/meed/onboarding/validate',
    method: 'get',
    handler: [
      handleValidation(ValidateInviter, ValidationLevel.Query),
      asyncWrapper(MeedOnboardingController.validateInviter)
    ]
  },
  {
    path: 'v1.0.0/meed/onboarding/:id',
    method: 'patch',
    handler: [handleValidation(Onboarding), asyncWrapper(MeedOnboardingController.updateOnboarding)]
  },
  {
    path: 'v1.0.0/meed/onboarding/countries',
    method: 'get',
    handler: [asyncWrapper(MeedOnboardingController.getCountries)]
  },
  {
    path: 'v1.0.0/meed/onboarding/countries/:countryId/states',
    method: 'get',
    handler: [asyncWrapper(MeedOnboardingController.getStates)]
  }
  //#endregion
];
