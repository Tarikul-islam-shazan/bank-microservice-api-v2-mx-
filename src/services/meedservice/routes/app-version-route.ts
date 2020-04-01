import { AppVersionController } from '../controllers/app-version-controller';
import { asyncWrapper } from '../../../middleware/asyncWrapper';
import handleValidation, { ValidationLevel } from '../../../middleware/validator';
import { createAppVersion, versionId, updateAppVersion, checkUpgrade } from '../validators/app-version/validator';
import AuthMiddleware from '../../../middleware/authMiddleware';

export const appVersionRoutes = [
  {
    path: 'v1.0.0/app-version',
    method: 'get',
    handler: [AuthMiddleware.isBankAuthenticated, asyncWrapper(AppVersionController.list)]
  },
  {
    path: 'v1.0.0/app-version',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(createAppVersion),
      asyncWrapper(AppVersionController.create)
    ]
  },
  {
    path: 'v1.0.0/app-version/upgrade',
    method: 'get',
    handler: [handleValidation(checkUpgrade, ValidationLevel.Query), asyncWrapper(AppVersionController.checkUpgrade)]
  },
  {
    path: 'v1.0.0/app-version/:id',
    method: 'patch',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(versionId, ValidationLevel.Params),
      handleValidation(updateAppVersion),
      asyncWrapper(AppVersionController.update)
    ]
  },
  {
    path: 'v1.0.0/app-version/:id',
    method: 'delete',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(versionId, ValidationLevel.Params),
      asyncWrapper(AppVersionController.delete)
    ]
  }
];
