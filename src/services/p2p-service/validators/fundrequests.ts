import Joi from '@hapi/joi';
import { RequestStatus } from '../../models/p2p-service/fundrequests';

export const FundRequest = Joi.object({
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
  message: Joi.string()
});

export const FundRequestData = Joi.array()
  .items(FundRequest)
  .unique((v1, v2) => v1.receiverEmail === v2.receiverEmail);

export const UpdateFundRequest = Joi.object({
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
  confirmationCode: Joi.string().required(),
  requestStatus: Joi.string()
    .uppercase()
    .valid(RequestStatus.CANCELLED, RequestStatus.DECLINED)
    .required()
});
