import { Response } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';
import DIContainer from '../../utils/ioc/ioc';
import { ICardService, ICard } from '../models/card-service';
import { TYPES } from '../../utils/ioc/types';

class CardServiceController {
  static async cardDetails(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<ICardService>(TYPES.AxBankCardService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const customerId = req.params.customerId;
    const cards: ICard[] = await service.getCardDetails(customerId);

    res.status(200).json({ cards });
  }

  static async updateCardState(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<ICardService>(TYPES.AxBankCardService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const { cardId, state } = req.params;
    const customerId = req.get('meedbankingclub-customerid');

    const card = await service.updateCardState({ customerId, cardId, state });

    res.status(200).json({ card });
  }
}

export default CardServiceController;
