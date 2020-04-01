import { asyncWrapper } from '../../middleware/asyncWrapper';
import AffinityServiceController from './affinityServiceController';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import { GetCategory, CustomerId } from './validators';

export default [
  {
    path: 'v1.0.0/offers',
    method: 'get',
    handler: [
      handleValidation(CustomerId, ValidationLevel.Headers),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(AffinityServiceController.getOffers)
    ]
  },
  {
    path: 'v1.0.0/offers/categories',
    method: 'get',
    handler: [
      handleValidation(GetCategory, ValidationLevel.Headers),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(AffinityServiceController.getCategoryList)
    ]
  },
  {
    path: 'v1.0.0/offers/featured',
    method: 'get',
    handler: [
      handleValidation(CustomerId, ValidationLevel.Headers),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(AffinityServiceController.getFeaturedOffers)
    ]
  },
  {
    path: 'v1.0.0/offers/:offerId',
    method: 'get',
    handler: [
      handleValidation(CustomerId, ValidationLevel.Headers),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(AffinityServiceController.getOfferDetails)
    ]
  },
  {
    path: 'v1.0.0/offers/:offerId/activate',
    method: 'post',
    handler: [
      handleValidation(CustomerId, ValidationLevel.Headers),
      AuthMiddleware.isBankAuthenticated,
      asyncWrapper(AffinityServiceController.activateOffer)
    ]
  }
];
