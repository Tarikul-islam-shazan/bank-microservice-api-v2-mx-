import { StaticDataRepository } from './../repository/static-data';

import { CommonUtils, DbSearchParams } from '../../../utils/common';
import { IStaticData } from '../../models/meedservice';

export class StaticDataService {
  private static staticDataRepository = new StaticDataRepository();
  constructor() {}

  //#region static data Crud Operations

  /**
   *  Finds and returns a country based on the id.
   *
   * @static
   * @param {string} staticDataId
   * @returns {Promise<IStaticData>}
   * @countryof StaticDataService
   */
  static async findById(staticDataId: string): Promise<IStaticData> {
    const retVal = await this.staticDataRepository.findById(staticDataId);
    return retVal as IStaticData;
  }

  /**
   *  Finds and returns a static data based on some search criteria.
   *
   *
   * @static
   * @param {string} qs
   * @returns {Promise<IStaticData>}
   * @countryof StaticDataService
   */
  static async find(qs: string): Promise<IStaticData[]> {
    let search: DbSearchParams = {};

    if (qs) {
      search = CommonUtils.getDbSearchParams(qs);
    }

    return await this.staticDataRepository.find(
      search.filter,
      search.projection,
      search.sort,
      search.limit,
      search.skip
    );
  }

  /**
   * find and return staticData by bankId
   *
   * @static
   * @param {string} bankId
   * @returns {Promise<IStaticData>}
   * @memberof StaticDataService
   */
  static async findByBankId(bankId: string): Promise<IStaticData[]> {
    const staticData = await this.staticDataRepository.find(
      { bank: bankId },
      { __v: 0, updatedDate: 0, createdDate: 0, bank: 0 }
    );
    return staticData;
  }

  static async findDefaultInviterEmail(): Promise<{ email: string }> {
    const defaultInviterEmail = await this.staticDataRepository.findOne({ category: 'DefaultInviter' });
    return { email: defaultInviterEmail.data.email };
  }
  //#endregion
}
