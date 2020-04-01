import { IBankService } from '../shared/interface';

export interface ICardService extends IBankService {
  getCardDetails(customerId: string): Promise<ICard[]>;
  updateCardState(params: ICardParams): Promise<ICard>;
}

export interface ICard {
  cardId: string;
  cardNumber: string;
  isCardActive: boolean;
}

export interface ICardParams {
  customerId: string;
  cardId: string;
  state: string;
}
