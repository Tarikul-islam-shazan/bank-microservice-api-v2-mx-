import { CountryRepository } from './../repository/country-repository';
import { ICountry } from '../../models/meedservice';
import { CommonUtils, DbSearchParams } from '../../../utils/common';

export class CountryService {
  private static countryRepository = new CountryRepository();
  constructor() {}

  //#region country Crud Operations
  /**
   *  Creates a new country with the parameters that are passed in.
   *
   * @static
   * @param {ICountry} country
   * @returns {Promise<ICountry>}
   * @countryof MeedService
   */
  static async create(country: ICountry): Promise<ICountry> {
    const retVal = await this.countryRepository.create(country);
    return retVal;
  }

  /**
   *  Finds and returns a country based on the id.
   *
   * @static
   * @param {string} countryId
   * @returns {Promise<ICountry>}
   * @countryof MeedService
   */
  static async findById(countryId: string): Promise<ICountry> {
    const retVal = await this.countryRepository.findById(countryId);
    return retVal as ICountry;
  }

  /**
   *  Finds and returns a country based on some search criteria, otherwise
   *   returns all countrys
   *
   * @static
   * @param {string} countryId
   * @returns {Promise<ICountry>}
   * @countryof MeedService
   */
  static async find(qs: string): Promise<ICountry[]> {
    let search: DbSearchParams = {};

    if (qs) {
      search = CommonUtils.getDbSearchParams(qs);
    }

    return await this.countryRepository.find(search.filter, search.projection, search.sort, search.limit, search.skip);
  }

  /**
   *  Updates a country based on the fields that are passed it. It can be one or multiple
   *  fields updated at once.
   *
   * @static
   * @param {string} countryId
   * @param {ICountry} country
   * @returns {(Promise<ICountry | null>)}
   * @countryof MeedService
   */
  static async update(countryId: string, country: ICountry): Promise<ICountry | null> {
    // TODO add method documentation to all functions

    // check to see what fields are present on the object to determine business logic to perform
    // on whether to allow the update and under what conditions
    // the object should only contain those fields which are being updated

    const retVal = await this.countryRepository.findByIdAndUpdate(countryId, country);
    return retVal;
  }

  /**
   *  Removes the country from the database.
   *
   * @static
   * @param {string} countryId
   * @returns {Promise<boolean>}
   * @countryof MeedService
   */
  static async delete(countryId: string): Promise<boolean> {
    const retVal = await this.countryRepository.delete(countryId);
    return retVal;
  }
  //#endregion
}
