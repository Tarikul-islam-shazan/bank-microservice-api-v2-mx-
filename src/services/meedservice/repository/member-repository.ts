import { IMemberModel, MemberModel } from '../models/member';
import { IMember } from '../../models/meedservice/member';
import { BaseRepository } from './repository';

export class MemberRepository extends BaseRepository<IMember, IMemberModel> {
  constructor() {
    super(MemberModel);
  }
}
