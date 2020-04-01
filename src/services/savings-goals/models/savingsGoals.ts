import mongoose, { Schema, Document } from 'mongoose';

const SavingsGoalsSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    targetAmount: {
      type: Number
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: Date.now
    },
    yearOfSaving: {
      type: Number
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member'
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface ISavingsGoals {
  id?: any;
  name: string;
  targetAmount: number;
  startDate: Date;
  endDate: Date;
  yearOfSaving: number;
  memberId: string;
  createdDate: Date;
}
export interface ISavingsGoalsSchemaModel extends ISavingsGoals, Document {}
export const SavingsGoalsModel = mongoose.model<ISavingsGoalsSchemaModel>('SavingsGoals', SavingsGoalsSchema);
