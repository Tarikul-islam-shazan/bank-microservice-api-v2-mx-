import Joi from '@hapi/joi';

export const MeedShareGetStatistics = Joi.object({
  memberId: Joi.string().required()
});
