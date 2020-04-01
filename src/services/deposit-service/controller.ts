import { Response, NextFunction } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';
import { IDepositService } from '../models/deposit-service/interface';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';

export class DepositServiceController {
  public static async depositFund(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.get('meedbankingclub-memberid');
    const service = DIContainer.getNamed<IDepositService>(TYPES.AxBankDepositService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    const response = await service.depositFund(req.body, memberId);
    res.status(200).json(response);
  }

  public static async depositMoney(req: MeedRequest, res: Response): Promise<any> {
    const service = DIContainer.getNamed<IDepositService>(TYPES.AxBankDepositService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    const response = await service.depositMoney(req.body);
    res.status(200).json(response);
  }

  public static async depositCheck(req: MeedRequest, res: Response): Promise<any> {
    const service = DIContainer.getNamed<IDepositService>(TYPES.AxBankDepositService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    const response = await service.depositCheck(req.body, req.files ? req.files : '');
    res.status(200).json(response);
  }
}
