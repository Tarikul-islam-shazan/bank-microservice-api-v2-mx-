import { MeedShareRepository } from './repository';
import { IMeedShare } from '../models/meed-share/interface';
import { ResponseMapper } from './mappers';

export class MeedShareService {
  private static repository = new MeedShareRepository();
  constructor() {}

  /**
   * Finds and returns a meed share statistics based on the id.
   *
   * @static
   * @param {string} memberId
   * @returns {Promise<IMeedShare>}
   * @memberof MeedShareService
   */
  static async getLatest(memberId: string): Promise<IMeedShare> {
    const meedShare = await this.repository.getLatest(memberId);
    return ResponseMapper.meedShare(meedShare);
  }
}
