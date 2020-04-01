import { Response } from 'express';
import { MeedRequest } from '../../../interfaces/MeedRequest';
import DIContainer from '../../../utils/ioc/ioc';
import { TYPES } from '../../../utils/ioc/types';
import { IFundRequestService } from '../../models/p2p-service/fundrequests';

class FundRequestController {
  private static getService(req: MeedRequest): IFundRequestService {
    const service = DIContainer.getNamed<IFundRequestService>(TYPES.FundRequestService, req.bankId);
    return service;
  }

  static async createFundRequest(req: MeedRequest, res: Response): Promise<void> {
    const response = await FundRequestController.getService(req).createFundRequest(req.body);
    res.status(200).json({ requests: response });
  }

  static async getFundRequests(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.get('meedbankingclub-memberid');
    const response = await FundRequestController.getService(req).getFundRequests(memberId);
    res.status(200).json({ requests: response });
  }

  static async updateFundRequest(req: MeedRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const memberId = req.get('meedbankingclub-memberid');
    const updateData = req.body;
    const response = await FundRequestController.getService(req).updateFundRequest(id, memberId, updateData);
    res.status(200).json({ request: response });
  }

  static async removeFundRequest(req: MeedRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const memberId = req.get('meedbankingclub-memberid');
    const response = await FundRequestController.getService(req).removeFundRequest(id, memberId);
    res.status(200).json({ request: response });
  }
}

export default FundRequestController;
