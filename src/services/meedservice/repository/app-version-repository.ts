import { IAppVersion } from '../../models/meedservice/app-version';
import { IAppVersionModel, AppVersionModel } from '../models/app-version';
import { BaseRepository } from './repository';

export class AppVersionRepository extends BaseRepository<IAppVersion, IAppVersionModel> {
  constructor() {
    super(AppVersionModel);
  }

  async findOne(condition: any, sort: any = {}): Promise<IAppVersionModel | null> {
    return await this.model
      .findOne(condition)
      .sort(sort)
      .exec();
  }
}
