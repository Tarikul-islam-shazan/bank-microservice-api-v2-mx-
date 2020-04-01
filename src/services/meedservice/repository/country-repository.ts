import { ICountry } from '../../models/meedservice';
import { BaseRepository } from './repository';
import { CountryModel, ICountryModel } from '../models/country';

export class CountryRepository extends BaseRepository<ICountry, ICountryModel> {
  constructor() {
    super(CountryModel);
  }
}
