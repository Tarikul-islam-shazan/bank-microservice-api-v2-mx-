import { BankAtmRepository } from './repository/bank-atm';
import { IBankAtm, IGeoLocation } from '../models/bank-atms/interface';
import { MeedService } from '../meedservice/service';
import { IBank } from '../models/meedservice/bank';
import { AtmErrorCodes, AtmErrMapper } from './errors';
import { HTTPError } from '../../utils/httpErrors';
import { BankAtmUtil } from './util';
import { GMapClient } from '../../utils/google-map';
import { BankAtmModel } from './models';
import { ICountry, UnitOfMeasureType } from '../models/meedservice';

export class BankAtmService {
  private static bankAtmRepository = new BankAtmRepository();
  constructor() {}

  /**
   * @static
   * @param {*} condition
   * @param {*} projection
   * @param {*} sort
   * @returns {Promise<IBankAtm[]>}
   * @memberof BankAtmService
   */
  static async find(condition: any, projection: any, sort: any): Promise<IBankAtm[]> {
    const retVal = await this.bankAtmRepository.find(condition, projection, sort);
    const atmList = retVal.map(atm => {
      const dist = BankAtmUtil.adjustDecimal('round', parseFloat(String(atm.distance)), -2);
      atm = new BankAtmModel(atm).toJSON();
      atm.distance = dist;
      atm.location = BankAtmUtil.toLatLng((atm.location as unknown) as IGeoLocation);
      return atm;
    });
    return atmList as IBankAtm[];
  }

  /**
   * @static
   * @param {*} condition
   * @returns {Promise<IBankAtm>}
   * @memberof BankAtmService
   */
  static async findOne(condition: any): Promise<IBankAtm> {
    const retVal = await this.bankAtmRepository.findOne(condition);
    retVal.location = BankAtmUtil.toLatLng((retVal.location as unknown) as IGeoLocation);
    return retVal as IBankAtm;
  }

  /**
   * Find nearby atms given latitude & longitude or given address
   *
   * @static
   * @param {IBankAtm} queryData
   * @param {(string | null)} unitOfMeasure
   * @param {(string | null)} address
   * @returns {Promise<IBankAtm[]>}
   * @memberof BankAtmService
   */
  static async findNearby(
    queryData: IBankAtm,
    unitOfMeasure: string | null,
    address: string | null
  ): Promise<IBankAtm[]> {
    const bank: IBank = await MeedService.findABankById(queryData.bank, 'country');
    if (!bank) {
      const { message, errorCode, httpCode } = AtmErrorCodes.NO_BANK_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }

    bank.banksSharingAtms.push(queryData.bank);
    if (!unitOfMeasure) {
      unitOfMeasure =
        bank.country && typeof bank.country === 'object'
          ? (bank.country as ICountry).unitOfMeasure
          : UnitOfMeasureType.Metric;
    }

    const near: IGeoLocation = address
      ? await this.getAddressLocation(address)
      : BankAtmUtil.toGeoJson(queryData.latitude, queryData.longitude);

    const { distance, distanceMultiplier } = BankAtmUtil.getMultiplier(queryData.distance || 1, unitOfMeasure);
    const query: any = { bank: { $in: bank.banksSharingAtms } };

    if (queryData.locationType) {
      query.locationType = queryData.locationType;
    }

    const locations = await this.bankAtmRepository.getNearbyAtms(near, query, distanceMultiplier, distance);
    const atmList = locations.map(atm => {
      const dist = BankAtmUtil.adjustDecimal('round', parseFloat(String(atm.distance)), -2);
      atm = new BankAtmModel(atm).toJSON();
      atm.distance = dist;
      atm.location = BankAtmUtil.toLatLng((atm.location as unknown) as IGeoLocation);
      return atm;
    });

    return atmList as IBankAtm[];
  }

  /**
   * Get geoLocation of a given address
   * @private
   * @static
   * @param {string} address
   * @returns {Promise<IGeoLocation>}
   * @memberof BankAtmService
   */
  private static async getAddressLocation(address: string): Promise<IGeoLocation> {
    try {
      const mapResponse = await GMapClient.geocode({ address }).asPromise();

      // googel map can return empty/zero result for invalid or empty address
      if (mapResponse.json.results.length === 0) {
        const { message, errorCode, httpCode } = AtmErrorCodes.NO_ADDRESS_RESULT;
        throw new HTTPError(message, errorCode, httpCode);
      }

      const geoLocation: IGeoLocation = BankAtmUtil.toGeoJson(
        String(mapResponse.json.results[0].geometry.location.lat),
        String(mapResponse.json.results[0].geometry.location.lng)
      );

      return geoLocation;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = AtmErrMapper.gmapError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
