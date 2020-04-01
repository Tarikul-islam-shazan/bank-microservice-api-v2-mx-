import Joi from '@hapi/joi';

export const CreateVerificationCode = Joi.object({
  email: Joi.string()
    .email()
    .required()
});

export const VerifyEmailCode = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  verificationCode: Joi.string().required()
});
