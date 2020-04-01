import { BaseRepository } from './repository';
import { IPromotionSchemaModel, PromotionModel } from '../models/promotion';
import { IPromotion } from '../../models/promotion-service/interface';

export class PromotionRepository extends BaseRepository<IPromotion, IPromotionSchemaModel> {
  constructor() {
    super(PromotionModel);
  }
}
