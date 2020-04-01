import mongoose, { Schema, Document } from 'mongoose';
import { RequestStatus, IFundRequest } from '../../models/p2p-service/fundrequests';

const FundRequestSchema = new Schema(
  {
    senderEmail: {
      type: String,
      required: true,
      lowercase: true
    },
    receiverEmail: {
      type: String,
      required: true,
      lowercase: true
    },
    requestStatus: {
      type: String,
      enum: Object.keys(RequestStatus),
      default: RequestStatus.PENDING
    },
    amount: {
      type: Number,
      required: true
    },
    message: String,
    confirmationCode: String
  },
  {
    timestamps: true
  }
);

export interface FundRequestModel extends IFundRequest, Document {}
export const FundRequestModel = mongoose.model<FundRequestModel>('FundRequest', FundRequestSchema);
