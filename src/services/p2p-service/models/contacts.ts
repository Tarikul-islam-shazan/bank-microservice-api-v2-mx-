import mongoose, { Schema, Document } from 'mongoose';
import { ContactType, IMeedContact } from '../../models/p2p-service/contacts';

const ContactSchema = new Schema(
  {
    belongTo: {
      type: Schema.Types.ObjectId,
      ref: 'Members'
    },
    email: {
      type: String,
      unique: true
    },
    contactType: {
      type: String,
      enum: Object.keys(ContactType),
      default: ContactType.MEED
    }
  },
  {
    timestamps: true
  }
);

export interface ContactModel extends IMeedContact, Document {}
export const ContactModel = mongoose.model<ContactModel>('Contact', ContactSchema);
