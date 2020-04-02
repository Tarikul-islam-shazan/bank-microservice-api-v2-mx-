import { injectable, inject, named } from 'inversify';
import { TYPES } from '../../utils/ioc/types';
import { IAuthorization } from '../bank-auth/models/interface';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import { ICardService, ICard, ICardParams } from '../models/card-service/index';
import { MeedAxios } from '../../utils/api';
import ResponseMapper from './mappers/response-mapper';
import { AxErrorMapper } from '../../utils/error-mapper/axError';
import { HTTPError } from '../../utils/httpErrors';
import config from '../../config/config';

@injectable()
class AxxiomeCardService implements ICardService {
  private auth: IAuthorization;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  public async getCardDetails(customerId: string): Promise<ICard[]> {
    const headers = await this.auth.getBankHeaders();
    try {
      const cardData = await MeedAxios.getAxiosInstance().get(
        `/cardInquiry/${config.api.axxiome.version}/cards/${customerId}`,
        headers
      );
      const mappedCardData = ResponseMapper.transformCardDetails(cardData);

      return mappedCardData;
    } catch (err) {
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async updateCardState(params: ICardParams): Promise<any> {
    const headers = await this.auth.getBankHeaders();
    const { customerId, cardId, state } = params;
    try {
      const card = await MeedAxios.getAxiosInstance().put(
        `cardInquiry/${config.api.axxiome.version}/cards/${customerId}/${cardId}/${state}`,
        {},
        headers
      );

      return card.data;
    } catch (err) {
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default AxxiomeCardService;
