import Joi from '@hapi/joi';
import { P2PTransferType } from '../../models/p2p-service/interface';

export const P2PFundTransferBody = Joi.object({
  senderEmail: Joi.string()
    .email()
    .required(),
  receiverEmail: Joi.string()
    .email()
    .required()
    .invalid(Joi.ref('senderEmail')),
  amount: Joi.number()
    .min(1)
    .positive()
    .required(),
  message: Joi.string(),
  confirmationCode: Joi.string().optional(),
  senderAccountId: Joi.string().required(),
  senderCustomerId: Joi.string(),
  receiverCustomerId: Joi.string(),
  receiverCurrency: Joi.string(),
  receiverName: Joi.string(),
  sharedSecret: Joi.string(),
  transferType: Joi.string()
    .uppercase()
    .valid(...Object.keys(P2PTransferType))
    .required()
});

export const TransferFundHeaders = Joi.object({
  'meedbankingclub-bank-identifier': Joi.string().required(),
  'meedbankingclub-username': Joi.string().required(),
  'meedbankingclub-memberid': Joi.string().required(),
  'meedbankingclub-customerid': Joi.string().required(),
  'meedbankingclub-otp-id': Joi.string(),
  'meedbankingclub-otp-token': Joi.string()
});
