import { IBankService } from '../shared/interface';

export interface IPromotionService extends IBankService {
  getPromotion(memberId: string): Promise<IPromotion>;
  getPromotionForInviter(memberId: string): Promise<IPromotion>;
}

export interface IPromotion {
  id?: any;
  promotionCode: string;
}

/**
 * Axxiome supported promotion code
 *
 * @export
 * @enum {number}
 */
export const enum AxPromotionCode {
  NO_REBATE = 'NO_REBATE',
  FULL_REBATE = 'FULL_REBATE',
  PARTIAL_REBATE = 'PARTIAL_REBATE',
  FULL_REFUND_3MNT = 'FULL_REFUND_3MNT',
  PARTIAL_REFUND_6MNT = 'PARTIAL_REFUND_6MNT'
}

export const AxDefaultPromotionCode = AxPromotionCode.NO_REBATE;
