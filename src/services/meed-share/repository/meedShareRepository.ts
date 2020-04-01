import { IMeedShare } from '../../models/meed-share/interface';
import { BaseRepository } from './repository';
import { MeedShareModel, IMeedShareModel } from '../models';
export class MeedShareRepository extends BaseRepository<IMeedShare, IMeedShareModel> {
  constructor() {
    super(MeedShareModel);
  }

  async getLatest(memberId) {
    return await this.model
      .findOne({ member: memberId })
      .sort({ createdDate: 'desc' })
      .exec();
  }
}
