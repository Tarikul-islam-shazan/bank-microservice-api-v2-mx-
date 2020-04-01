import { BaseRepository } from './repository';
import { BankAssignmentModel, IBankAssignmentModel } from '../models/bank-assignment';
import { IBankAssignment } from '../../models/meedservice';

export class BankAssignmentRepository extends BaseRepository<IBankAssignment, IBankAssignmentModel> {
  constructor() {
    super(BankAssignmentModel);
  }
}
