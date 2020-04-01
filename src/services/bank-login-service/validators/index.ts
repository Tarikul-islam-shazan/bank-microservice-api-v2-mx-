import Joi from '@hapi/joi';

export const LoginCredentials = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
