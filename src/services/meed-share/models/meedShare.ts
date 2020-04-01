import { IMeedShare } from '../../models/meed-share/interface';
import mongoose, { Schema, Document } from 'mongoose';

const MeedShareSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member'
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country'
    },
    memberType: {
      type: 'String'
    },
    lastMonthDistribution: Number,
    totalDistribution: Number,
    totalInvitees: Number
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IMeedShareModel extends IMeedShare, Document {}
export const MeedShareModel = mongoose.model<IMeedShareModel>('MeedShare', MeedShareSchema);
