import { SavingsGoalsRepository } from './repository/savingsGoalsRepository';
import { ISavingsGoals } from './models/savingsGoals';
import { HTTPError } from '../../utils/httpErrors';
import moment from 'moment';
import { SavingsGoalsErrCodes } from './errors';
export class SavingsGoalsService {
  private static repository = new SavingsGoalsRepository();

  constructor() {}

  /**
   * Get savings goals list
   *
   * @static
   * @param {string} memberId
   * @returns {Promise<ISavingsGoals[]>}
   * @memberof SavingsGoalsService
   */
  static async getSavingsGoals(memberId: string): Promise<ISavingsGoals[]> {
    // get only active savings goals
    const retVal = await this.repository.find({ memberId, endDate: { $gte: moment.utc().format() } });
    return retVal as ISavingsGoals[];
  }

  static async saveSavingsGoals(savingsGoals: ISavingsGoals): Promise<ISavingsGoals> {
    const retVal = await this.repository.create(savingsGoals);
    return retVal;
  }

  static async updateSavingsGoals(id: string, savingsGoals: ISavingsGoals) {
    const retVal = await this.repository.findByIdAndUpdate(id, savingsGoals);
    return retVal;
  }

  static async deleteSavingsGoals(memberId: string, id: string) {
    // check if goals existed
    const goal = await this.repository.findOne({ _id: id, memberId });
    if (!goal) {
      const { message, errorCode } = SavingsGoalsErrCodes.INVALID_SAVINGS_GOALS;
      throw new HTTPError(message, errorCode, 400);
    }
    // delete goals
    const retVal = await this.repository.delete(id);
    return retVal;
  }
}
