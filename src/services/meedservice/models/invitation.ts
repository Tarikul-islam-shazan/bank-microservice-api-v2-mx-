import mongoose, { Schema, Document } from 'mongoose';
import { InvitationStatus, IInvitation } from '../../models/meedservice/invitation';

const InvitationSchema = new Schema(
  {
    inviter: {
      type: Schema.Types.ObjectId,
      ref: 'Members'
    },
    language: {
      type: String
    },
    inviteeEmail: String,
    message: String,
    status: {
      type: String,
      enum: Object.values(InvitationStatus),
      default: InvitationStatus.Sent
    },
    expirationDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IInvitationModel extends IInvitation, Document {}

export const InvitationModel = mongoose.model<IInvitationModel>('Invitation', InvitationSchema);
