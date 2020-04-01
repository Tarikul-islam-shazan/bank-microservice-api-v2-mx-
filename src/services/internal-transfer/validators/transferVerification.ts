import Joi, { required } from '@hapi/joi';
import { TransferType } from '../../models/internal-transfer/interface';

export const Transfer = Joi.object({
  debtorAccount: Joi.string().required(),
  creditorAccount: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  notes: Joi.string()
    .allow('')
    .optional(),
  transferDate: Joi.date(),
  frequency: Joi.string().required()
});

export const UpdateTransfer = Transfer.append({
  transferId: Joi.string().required(),
  previousTransferType: Joi.string().required()
});

export const DeleteTransfer = Joi.object({
  transferId: Joi.string().required(),
  transferType: Joi.string()
    .valid(...Object.keys(TransferType))
    .required()
});
