import Joi from '@hapi/joi';

export const MemberIdRequired = Joi.object({
  'meedbankingclub-memberid': Joi.string().required()
});
