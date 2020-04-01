import Joi, { required } from '@hapi/joi';

export const depositFund = Joi.object({
  email: Joi.string().required(),
  name: Joi.string()
    .allow('')
    .optional(),
  address: Joi.string()
    .allow('')
    .optional(),
  city: Joi.string()
    .allow('')
    .optional(),
  state: Joi.string()
    .allow('')
    .optional(),
  zipCode: Joi.string()
    .allow('')
    .optional(),
  accountNumber: Joi.string().required(),
  bankRoutingNumber: Joi.string().required(),
  businessName: Joi.string().required()
});

export const depositFundHeader = Joi.object({
  'meedbankingclub-memberid': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required()
});

export const depositCheck = Joi.object({
  amount: Joi.string().required(),
  currency: Joi.string().required(),
  depositDate: Joi.string().required(),
  notes: Joi.string().required(),
  accountNumber: Joi.string().required(),
  deviceKey: Joi.string().required(),
  deviceDescription: Joi.string().required()
});

export const depositMoney = Joi.object({
  checkingAmount: Joi.string().required(),
  currency: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  paymentTrackingID: Joi.string().required(),
  savingAmount: Joi.string().required(),
  totalAmount: Joi.string().required()
});
