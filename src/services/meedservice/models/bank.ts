import mongoose, { Schema, Document } from 'mongoose';
import { IBank } from '../../models/meedservice/bank';

export enum Currency {
  USD = 'USD',
  MXD = 'MXD',
  CAD = 'CAD'
}

export enum Locales {
  EN_US = 'en-us',
  ES_MX = 'es-mx'
}

const BankSchema = new Schema({
  name: {
    type: String,
    required: [true]
  },
  shortName: {
    type: String,
    required: [true]
  },
  api: String,
  currency: { type: String, enum: Object.values(Currency) },

  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  banksSharingAtms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bank'
    }
  ],
  supportedLocales: [
    {
      type: String,
      enum: Object.values(Locales)
    }
  ],
  identifier: String,
  billPayProvider: String
});

export interface IBankModel extends IBank, Document {}
export const BankModel = mongoose.model<IBankModel>('Bank', BankSchema);
