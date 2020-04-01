import Joi from '@hapi/joi';

export const validateCardParams = Joi.object({
  cardId: Joi.string().required(),
  state: Joi.string()
    .allow('lock', 'unlock')
    .valid('lock', 'unlock')
    .required()
});
