import { AccountStatus, ApplicationProgress, ApplicationStatus } from '../../models/meedservice/member';
import mongoose, { Schema, Document } from 'mongoose';
import { ITransition } from '../../models/meedservice/transition';

const TransitionSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    bankId: { type: Schema.Types.ObjectId, ref: 'Bank' },
    status: {
      type: String,
      enum: Object.values({ ...ApplicationStatus, ...ApplicationProgress, ...AccountStatus })
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);
TransitionSchema.index({ memberId: 1, status: 1 }, { unique: true, dropDups: true });

export interface ITransitionModel extends ITransition, Document {}
export const TransitionModel = mongoose.model<ITransitionModel>('Transitions', TransitionSchema);
