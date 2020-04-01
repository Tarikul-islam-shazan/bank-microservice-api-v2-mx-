import mongoose, { Schema, Document } from 'mongoose';

const EmailVerificationSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    validated: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      required: true
    },
    numberOfTries: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);
export interface IEmailVerification {
  id?: any;
  email: string;
  validated: boolean;
  verificationCode: string;
  numberOfTries: number;
  createdDate: Date;
}
export interface IEmailVerificationModel extends IEmailVerification, Document {}
export const EmailVerificationModel = mongoose.model<IEmailVerificationModel>(
  'EmailVerification',
  EmailVerificationSchema
);
