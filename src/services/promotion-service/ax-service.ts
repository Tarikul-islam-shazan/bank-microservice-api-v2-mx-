import { PromotionRepository } from './repository/promotionRepository';
import { HTTPError } from '../../utils/httpErrors';
import { IPromotion, IPromotionService, AxDefaultPromotionCode } from '../models/promotion-service/interface';
import { IAuthorization } from '../bank-auth/models/interface';
import { injectable, inject, named } from 'inversify';
import { TYPES } from '../../utils/ioc/types';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import { MeedService } from '../meedservice/service';
import { MemberType } from '../models/meedservice';
import { PromotionErrCodes } from './errors';

@injectable()
export class AxPromotionService implements IPromotionService {
  private auth: IAuthorization;
  private repository = new PromotionRepository();

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  /**
   * Get promotion for a corporate member
   *
   * @static
   * @param {string} memberId
   * @returns {Promise<string[]>}
   * @memberof PromotionService
   */
  async getPromotion(memberId: string): Promise<IPromotion> {
    // check if member is corporate
    const member = await MeedService.findMemberById(memberId);
    if (!member) {
      // invalid member
      const { message, errorCode, statusCode } = PromotionErrCodes.INVALID_MEMBER;
      throw new HTTPError(message, errorCode, statusCode);
    }
    if (member.memberType !== MemberType.Corporate) {
      // not a corporate member
      const { message, errorCode, statusCode } = PromotionErrCodes.INVALID_MEMBER;
      throw new HTTPError(message, errorCode, statusCode);
    }

    const promotion = await this.repository.findOne({ memberId }, { promotionCode: 1, _id: 0 });
    if (!promotion) {
      // this is a corporate member without a promotion in promotion collection
      // So applying default promotion
      return { promotionCode: AxDefaultPromotionCode };
    }
    return promotion as IPromotion;
  }

  /**
   * Return promotion code from a members inviter
   * It will find the inviter from the member id provided and then fetch promotion
   * for that inviter
   *
   * @param {string} memberId
   * @returns
   * @memberof AxPromotionService
   */
  async getPromotionForInviter(memberId: string) {
    const member = await MeedService.findMemberById(memberId);
    if (!member || !member.inviter) {
      const { message, errorCode, statusCode } = PromotionErrCodes.INVALID_MEMBER;
      throw new HTTPError(message, errorCode, statusCode);
    }
    return await this.getPromotion(member.inviter);
  }
}
