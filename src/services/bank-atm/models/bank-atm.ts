import mongoose, { Schema, Document } from 'mongoose';
import { AtmLocationType, IBankAtm } from '../../models/bank-atms/interface';

const BankAtmSchema = new Schema(
  {
    bank: {
      type: Schema.Types.ObjectId,
      ref: 'Bank'
    },
    locationType: {
      type: String,
      enum: {
        values: Object.values(AtmLocationType),
        message: '{VALUE} is not an acceptable value for {PATH}'
      },
      default: AtmLocationType.Atm,
      required: [true, 'Location type is required']
    },
    city: String,
    phoneNumber: String,
    state: String,
    latitude: String,
    longitude: String,
    zipCode: String,
    streetAddress: String,
    locationName: String,
    serviceType: String,
    hours: [
      // not exists in sample db
      {
        lobbyHours: String,
        dayOfWeek: String
      }
    ],
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

BankAtmSchema.index({ location: '2dsphere' });

export interface IBankAtmModel extends IBankAtm, Document {}
export const BankAtmModel = mongoose.model<IBankAtmModel>('BankAtm', BankAtmSchema);
