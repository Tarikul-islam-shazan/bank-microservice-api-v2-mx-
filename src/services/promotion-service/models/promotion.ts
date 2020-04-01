import mongoose, { Schema, Document } from 'mongoose';
import { IPromotion } from '../../models/promotion-service/interface';

const PromotionSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member'
    },
    promotionCode: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    }
  }
);

export interface IPromotionSchemaModel extends IPromotion, Document {}
export const PromotionModel = mongoose.model<IPromotionSchemaModel>('Promotion', PromotionSchema);
