import Joi from '@hapi/joi';
import { DevicePlatform } from '../../../models/meedservice/app-version';

export const updateAppVersion = Joi.object({
  version: Joi.string().optional(),
  updateUrl: Joi.string().optional(),
  checkUpgrade: Joi.boolean().optional()
});

export const createAppVersion = Joi.object({
  version: Joi.string().required(),
  updateUrl: Joi.string().required(),
  platform: Joi.string()
    .allow(...Object.values(DevicePlatform))
    .required(),
  checkUpgrade: Joi.boolean().optional()
});

export const checkUpgrade = Joi.object({
  currentVersion: Joi.string().required(),
  platform: Joi.string()
    .allow(...Object.values(DevicePlatform))
    .required()
});

export const versionId = Joi.object({
  id: Joi.string().required()
});
