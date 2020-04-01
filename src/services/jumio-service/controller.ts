import { Response } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';
import { TYPES } from '../../utils/ioc/types';
import DIContainer from '../../utils/ioc/ioc';
import { JumioWebInitiateRequest, IJumioService } from '../models/jumio-service/interface';

class JumioServiceController {
  static async webInitiate(req: MeedRequest, res: Response): Promise<void> {
    const jumioData: JumioWebInitiateRequest = req.body;
    const service = DIContainer.getNamed<IJumioService>(TYPES.JumioService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const response = await service.webInitiate(jumioData);

    res.status(200).json(response);
  }

  static async verification(req: MeedRequest, res: Response): Promise<void> {
    const bankIdentifyer = req.params.identifier;
    const memberId = req.params.memberId;
    const verificationData = req.body;

    const service = DIContainer.getNamed<IJumioService>(TYPES.JumioService, bankIdentifyer);
    service.getAuthorizationService().setHeadersAndToken(req.headers);

    await service.verification(memberId, verificationData);
    res.status(201).json({});
  }

  static async retrieveDetails(req: MeedRequest, res: Response) {
    const service = DIContainer.getNamed<IJumioService>(TYPES.JumioService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const response = await service.retrieveDetails(req.query.reference);

    res.status(200).json(response);
  }
}

export default JumioServiceController;
