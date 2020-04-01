import { IStaticData } from '../../models/meedservice';
import { BaseRepository } from './repository';
import { StaticDataModel, IStaticDataModel } from '../models/static-data';

export class StaticDataRepository extends BaseRepository<IStaticData, IStaticDataModel> {
  constructor() {
    super(StaticDataModel);
  }
}
