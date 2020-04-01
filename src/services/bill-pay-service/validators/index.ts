import Joi from '@hapi/joi';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import { BillPayeeType, PaymentFrequency, BillPayProvider } from '../../models/bill-pay/interface';

export const payeeHeaders = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string()
    .valid(...Object.values(BankIdentifier))
    .required(),
  'meedbankingclub-billpay-provider': Joi.string()
    .valid(...Object.values(BillPayProvider))
    .required(),
  'meedbankingclub-username': Joi.string().required(),
  'meedbankingclub-customerid': Joi.string().required()
});

export const addPayee = Joi.object({
  fullName: Joi.string().required(),
  nickName: Joi.string()
    .allow('', null)
    .optional(),
  phone: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(BillPayeeType))
    .required(),
  street: Joi.string().required(),
  postCode: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  accountNumber: Joi.string().required()
});

export const editPayee = addPayee.append({});

export const createPayment = Joi.object({
  payeeId: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  executionDate: Joi.string().required(),
  frequency: Joi.string()
    .valid(...Object.values(PaymentFrequency))
    .required()
});

export const editPayment = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  executionDate: Joi.string().required()
});

export const ebillHeaders = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string()
    .valid(...Object.values(BankIdentifier))
    .required(),
  'meedbankingclub-billpay-provider': Joi.string()
    .valid(...Object.values(BillPayProvider))
    .required(),
  'meedbankingclub-customerid': Joi.string().required()
});

export const billerToken = Joi.object({
  memberEmail: Joi.string().required(),
  memberStatus: Joi.string().required(),
  memberType: Joi.string().required(),
  inviterEmail: Joi.string().required()
});
