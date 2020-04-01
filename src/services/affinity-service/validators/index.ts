import Joi from '@hapi/joi';

export const CustomerId = Joi.object({
  'meedbankingclub-customerid': Joi.string().required()
});

export const GetCategory = CustomerId.append({
  'meedbankingclub-memberid': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required(),
  'meedbankingclub-bank-identifier': Joi.string().required()
});
