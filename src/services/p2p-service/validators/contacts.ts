import Joi from '@hapi/joi';

export const UpdateContact = Joi.object({
  nickName: Joi.string(),
  email: Joi.string().email()
});
