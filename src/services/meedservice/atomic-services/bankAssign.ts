import { BankAssignmentRepository } from '../repository/bank-assignment';
import { BankAssignment } from '../util/bank-assignment';
import { IBankAssignmentResult } from '../../models/meedservice';

export class BankAssignmentService {
  private static assignmentRepository = new BankAssignmentRepository();
  constructor() {}

  /**
   * Assign a bank
   *
   * @static
   * @param {string} bankAssignment
   * @returns {Promise<IBankAssignment>}
   * @memberof BankAssignmentService
   */
  static async assignBank(country: string): Promise<IBankAssignmentResult> {
    const bank = await BankAssignment.getAssignedBank(country);
    return bank;
  }

  /** */
  static async findOneAndUpdate(condition: any, update: any, option: any) {
    return await this.assignmentRepository.findOneAndUpdate(condition, update, option);
  }
}
