import Joi from '@hapi/joi';

export const UpdateLanguage = Joi.object({
  language: Joi.string().required()
});

export const VerifyMember = Joi.array()
  .items(Joi.string())
  .required();
