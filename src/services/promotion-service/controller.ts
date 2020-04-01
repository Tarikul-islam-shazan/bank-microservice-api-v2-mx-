import { Request, Response } from 'express';
import { AxPromotionService } from './ax-service';
import { MeedRequest, BankIdentifier } from '../../interfaces/MeedRequest';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import { IPromotionService } from '../models/promotion-service/interface';

export class PromotionController {
  private static getService(req: MeedRequest): IPromotionService {
    const service = DIContainer.getNamed<IPromotionService>(TYPES.PromotionService, BankIdentifier.Axiomme);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    return service;
  }

  public static async getPromotion(req: Request, res: Response): Promise<void> {
    const memberId = req.params.memberId as string;
    const response = await PromotionController.getService(req).getPromotion(memberId);
    res.status(200).json(response);
  }
}
