import Joi from '@hapi/joi';

export const MemberIdRequired = Joi.object({
  'meedbankingclub-memberid': Joi.string().required()
});

export const SaveSavingsGoals = Joi.object({
  name: Joi.string().required(),
  targetAmount: Joi.number().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  yearOfSaving: Joi.number().required(),
  memberId: Joi.string().required()
});

export const UpdateSavingsGoals = Joi.object({
  _id: Joi.string(),
  name: Joi.string(),
  targetAmount: Joi.number(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  yearOfSaving: Joi.number(),
  memberId: Joi.string()
}).or('name', 'targetAmount', 'startDate', 'endDate', 'yearOfSaving', 'memberId');
