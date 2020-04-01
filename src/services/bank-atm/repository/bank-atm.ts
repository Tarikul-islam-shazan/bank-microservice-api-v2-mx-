import { BaseRepository } from './repository';
import { BankAtmModel, IBankAtmModel } from '../models/bank-atm';
import { IBankAtm, IGeoLocation } from '../../models/bank-atms/interface';

export class BankAtmRepository extends BaseRepository<IBankAtm, IBankAtmModel> {
  constructor() {
    super(BankAtmModel);
  }

  /**
   * @param {IGeoLocation} near
   * @param {*} query
   * @param {number} distanceMultiplier
   * @param {number} maxDistance
   * @returns {Promise<IBankAtmModel[]>}
   * @memberof BankAtmRepository
   */
  async getNearbyAtms(
    near: IGeoLocation,
    query: any,
    distanceMultiplier: number,
    maxDistance: number
  ): Promise<IBankAtmModel[]> {
    const findQuery = [
      {
        $geoNear: {
          near,
          query,
          distanceMultiplier,
          distanceField: 'distance',
          maxDistance,
          spherical: true
        }
      }
    ];
    return await this.model.aggregate(findQuery).exec();
  }
}
