import { IInvitation } from '../../models/meedservice';
import { IInvitationModel, InvitationModel } from '../models/invitation';
import { BaseRepository } from './repository';
export class InvitationRepository extends BaseRepository<IInvitation, IInvitationModel> {
  constructor() {
    super(InvitationModel);
  }
}
