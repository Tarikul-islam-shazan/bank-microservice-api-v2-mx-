import { asyncWrapper } from '../../middleware/asyncWrapper';
import UrbanAirshipServiceController from './controller';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import {
  RegisterEmailAddress,
  UpdateEmailChannel,
  AssociateEmailToNamedUserId,
  AddInitialTags,
  AddRemoveTag,
  NamedUserLookup
} from './ validators/validator';
import AuthMiddleware from '../../middleware/authMiddleware';

export default [
  {
    path: 'v1.0.0/uas/email-channel',
    method: 'post',
    handler: [handleValidation(RegisterEmailAddress), asyncWrapper(UrbanAirshipServiceController.registerEmailAddress)]
  },
  {
    path: 'v1.0.0/uas/email-channel',
    method: 'put',
    handler: [handleValidation(UpdateEmailChannel), asyncWrapper(UrbanAirshipServiceController.updateEmailChannel)]
  },
  {
    path: 'v1.0.0/uas/named-user',
    method: 'post',
    handler: [
      handleValidation(AssociateEmailToNamedUserId),
      asyncWrapper(UrbanAirshipServiceController.associateEmailToNamedUserId)
    ]
  },
  {
    path: 'v1.0.0/uas/named-user',
    method: 'get',
    handler: [
      handleValidation(NamedUserLookup, ValidationLevel.Query),
      asyncWrapper(UrbanAirshipServiceController.namedUserLookup)
    ]
  },
  {
    path: 'v1.0.0/uas/named-user/initial-tags',
    method: 'post',
    handler: [handleValidation(AddInitialTags), asyncWrapper(UrbanAirshipServiceController.addInitialTags)]
  },
  {
    path: 'v1.0.0/uas/named-user/tags',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(AddRemoveTag),
      asyncWrapper(UrbanAirshipServiceController.addTag)
    ]
  },
  {
    path: 'v1.0.0/uas/named-user/tags',
    method: 'delete',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(AddRemoveTag),
      asyncWrapper(UrbanAirshipServiceController.removeTag)
    ]
  }
];
