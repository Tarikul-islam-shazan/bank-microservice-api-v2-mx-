import mongoose, { Schema, Document } from 'mongoose';
import { ICountry } from '../../models/meedservice/country';

const CountrySchema = new Schema(
  {
    countryName: {
      type: String,
      required: true
    },
    countryAbv: {
      type: String,
      required: true
    },
    unitOfMeasure: {
      type: String,
      required: false
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface ICountryModel extends ICountry, Document {}
export const CountryModel = mongoose.model<ICountryModel>('Country', CountrySchema);
