import mongoose, { Schema, Document } from 'mongoose';
import { ApplicationStatus, ApplicationProgress, AccountStatus, IMember, MemberType } from '../../models/meedservice';

const MemberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    priorEmails: { type: [String] },
    customerId: { type: String },
    nickname: { type: String, required: false },
    username: { type: String },
    inviterCode: { type: String },
    country: { type: Schema.Types.ObjectId, ref: 'Country' },
    inviter: { type: Schema.Types.ObjectId, ref: 'Members' },
    corporateTncAccepted: { type: Boolean },
    applicationStatus: { type: String, enum: Object.values(ApplicationStatus), default: ApplicationStatus.Started },
    applicationProgress: {
      type: String,
      enum: Object.values(ApplicationProgress),
      default: ApplicationProgress.EmailRegistered
    },
    accountStatus: { type: String, enum: Object.values(AccountStatus), default: AccountStatus.InProgress },
    bank: { type: Schema.Types.ObjectId, ref: 'Bank' },
    memberType: {
      type: String,
      enum: Object.values(MemberType),
      default: MemberType.Individual
    },
    language: { type: String, default: 'en_US' }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IMemberModel extends IMember, Document {}
export const MemberModel = mongoose.model<IMemberModel>('Members', MemberSchema);
