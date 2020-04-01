import { MeedRequest } from '../../interfaces/MeedRequest';
import { Response } from 'express';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import { P2PTransferService } from './ax-service';
import { IP2PTransferStrategy, P2PTransferType } from '../models/p2p-service/interface';

class P2PTransferServiceController {
  static async transfer(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<P2PTransferService>(TYPES.P2PTransferService, req.bankId);
    const transferType: P2PTransferType = req.body.transferType.toUpperCase();
    const strategy = DIContainer.getTagged<IP2PTransferStrategy>(TYPES.P2PTransferStrategy, req.bankId, transferType);
    strategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    service.setTransferStrategy(strategy);
    const memberId = req.get('meedbankingclub-memberId');
    const response = await service.transfer(memberId, req.body);
    if (response && response.otpID) {
      res.set('meedbankingclub-otp-id', response.otpID);
      delete response.otpID;
      res.status(403).json({ data: response });
    } else {
      res.status(200).json(response);
    }
  }
}

export default P2PTransferServiceController;
