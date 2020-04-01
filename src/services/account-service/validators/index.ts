import Joi from '@hapi/joi';
import { SweepState } from '../../models/account-service/interface';

export const TransactionQueryValidate = Joi.object({
  amountFrom: Joi.number().optional(),
  amountTo: Joi.number().optional(),
  dateFrom: Joi.string().optional(),
  dateTo: Joi.string().optional(),
  includeCredits: Joi.boolean().optional(),
  includeDebits: Joi.boolean().optional(),
  keywords: Joi.string().optional()
});

export const SweepsHeader = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required()
});

export const SweepStates = Joi.object({
  state: Joi.string().valid(...Object.values(SweepState))
});
