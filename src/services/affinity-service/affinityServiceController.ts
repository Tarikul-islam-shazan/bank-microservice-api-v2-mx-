import AffinityService from './affinityService';
import { Request, Response, NextFunction } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';

export default class AffinityServiceController {
  public static async getCategoryList(req: MeedRequest, res: Response, next: NextFunction): Promise<any> {
    const response = await AffinityService.getCategoryList(req.headers, req.token);
    res.status(200).json(response);
  }

  public static async getOffers(req: Request, res: Response, next: NextFunction): Promise<any> {
    const uniqueId = req.header('meedbankingclub-customerid');
    const response = await AffinityService.getOffers(uniqueId, req.query);
    res.status(200).json(response);
  }

  public static async getFeaturedOffers(req: Request, res: Response, next: NextFunction): Promise<any> {
    const uniqueId = req.header('meedbankingclub-customerid');
    const response = await AffinityService.getFeaturedOffers(uniqueId);
    res.status(200).json(response);
  }

  public static async getOfferDetails(req: Request, res: Response, next: NextFunction): Promise<any> {
    const uniqueId = req.header('meedbankingclub-customerid');
    const offerId = req.params.offerId;
    const response = await AffinityService.getOfferDetails(uniqueId, offerId, req.query);
    res.status(200).json(response);
  }

  public static async activateOffer(req: Request, res: Response, next: NextFunction): Promise<any> {
    const uniqueId = req.header('meedbankingclub-customerid');
    const { offerId } = req.params;
    const response = await AffinityService.activateOffer(uniqueId, offerId);
    res.status(200).json({ data: response });
  }
}
