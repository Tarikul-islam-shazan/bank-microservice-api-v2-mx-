import Joi from '@hapi/joi';

export const SignUpEmail = Joi.object({
  email: Joi.string()
    .email({ tlds: false })
    .required()
});

export const Onboarding = Joi.object({
  nickname: Joi.string(),
  country: Joi.string(),
  inviterEmail: Joi.string(),
  inviterCode: Joi.string(),
  inviter: Joi.string().allow(null)
}).xor('inviterEmail', 'inviterCode', 'inviter');

export const ValidateInviter = Joi.object({
  inviterEmail: Joi.string(),
  inviterCode: Joi.string(),
  inviter: Joi.string().allow(null)
}).xor('inviterEmail', 'inviterCode', 'inviter');
