import Joi from '@hapi/joi';

export const RegisterEmailAddress = Joi.object({
  channel: Joi.object({
    type: Joi.string().required(),
    commercial_opted_in: Joi.string().optional(),
    address: Joi.string().required(),
    timezone: Joi.string().required(),
    locale_country: Joi.string().required(),
    locale_language: Joi.string().required()
  })
});

export const UpdateEmailChannel = Joi.object({
  channel: Joi.object({
    channelID: Joi.string().required(),
    type: Joi.string().required(),
    commercial_opted_in: Joi.string().required(),
    address: Joi.string().required()
  })
});

export const AssociateEmailToNamedUserId = Joi.object({
  channel_id: Joi.string().required(),
  device_type: Joi.string()
    .allow('')
    .optional(),
  named_user_id: Joi.string().required()
});

export const AddInitialTags = Joi.object({
  namedUser: Joi.string().required(),
  banks: Joi.array().required()
});

export const NamedUserLookup = Joi.object({
  namedUser: Joi.string().required()
});

export const AddRemoveTag = Joi.object({
  namedUser: Joi.string().required(),
  tag: Joi.string().required()
});
