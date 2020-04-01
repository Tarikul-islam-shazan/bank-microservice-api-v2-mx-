import { ITransitionModel, TransitionModel } from '../models/transition';
import { BaseRepository } from './repository';
import { ITransition } from '../../models/meedservice';

export class TransitionRepository extends BaseRepository<ITransition, ITransitionModel> {
  constructor() {
    super(TransitionModel);
  }

  async addBankId(memberId: string, update: Partial<ITransition>): Promise<ITransition[]> {
    const transions = await this.model.updateMany({ memberId, bankId: { $exists: false } }, { $set: update });
    return transions;
  }
}
