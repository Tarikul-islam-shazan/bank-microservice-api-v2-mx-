import mongoose, { Schema, Document } from 'mongoose';
import { IStaticData } from '../../models/meedservice/static-data';

const StaticDataSchema = new Schema(
  {
    category: String,
    subCategory: String,
    bank: {
      type: Schema.Types.ObjectId,
      ref: 'Bank'
    },
    data: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IStaticDataModel extends IStaticData, Document {}
export const StaticDataModel = mongoose.model<IStaticDataModel>('StaticData', StaticDataSchema);
