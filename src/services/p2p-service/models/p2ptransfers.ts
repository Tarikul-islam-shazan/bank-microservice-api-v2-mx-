import mongoose, { Schema, Document } from 'mongoose';
import { P2PTransferType, IP2PTransfer } from '../../models/p2p-service/interface';

const P2PTransferSchema = new Schema(
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
    amount: {
      type: Number,
      required: true
    },
    message: String,
    confirmationCode: String,
    transferType: {
      type: String,
      enum: Object.keys(P2PTransferType),
      required: true
    }
  },
  {
    timestamps: true
  }
);

export interface P2PTransferModel extends IP2PTransfer, Document {}
export const P2PTransferModel = mongoose.model<P2PTransferModel>('P2PTransfer', P2PTransferSchema);
