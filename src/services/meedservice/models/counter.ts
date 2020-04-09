import mongoose, { Schema, Document } from 'mongoose';
import { ICounter } from '../../models/meedservice/counter';

const CounterSchema = new Schema(
  {
    counterFor: { type: String },
    counterNumber: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface ICounterModel extends ICounter, Document {}
export const CounterModel = mongoose.model<ICounterModel>('Counter', CounterSchema);
