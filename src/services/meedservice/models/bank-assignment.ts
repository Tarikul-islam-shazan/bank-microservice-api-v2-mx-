import mongoose, { Schema, Document } from 'mongoose';
import { IBankAssignment } from '../../models/meedservice';

const BankAssignmentSchema = new Schema({
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  environment: String,
  counter: Number
});

export interface IBankAssignmentModel extends IBankAssignment, Document {}
export const BankAssignmentModel = mongoose.model<IBankAssignmentModel>('BankAssignment', BankAssignmentSchema);
