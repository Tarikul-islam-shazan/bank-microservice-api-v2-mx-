import { BaseRepository } from './repository';
import { SavingsGoalsModel, ISavingsGoalsSchemaModel, ISavingsGoals } from '../models/savingsGoals';

export class SavingsGoalsRepository extends BaseRepository<ISavingsGoals, ISavingsGoalsSchemaModel> {
  constructor() {
    super(SavingsGoalsModel);
  }
}
