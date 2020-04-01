import { BankService } from '../atomic-services/bank';
import { BankAssignmentService } from '../atomic-services/bankAssign';
import { IBankAssignmentResult } from '../../models/meedservice';
export class BankAssignment {
  constructor() {}

  /**
   *  Does a simple Round Robin modulo of by keeping a count of the number of attemps per country and env
   *  to signup.  Then it takes that and modulo's by the number of banks, and returns the next bank
   *  which is due to get a customer.
   *
   * If a qualifying bank is found for the given country, the id is returned, otherwise a null is returned.
   *
   * @param {string} countryId
   * @returns {(Promise<{ assignedBankId: string | null }>)}
   * @memberof BankAssignment
   */
  public static async getAssignedBank(countryId: string): Promise<IBankAssignmentResult> {
    const banks = await BankService.find(
      { country: countryId },
      { bankName: 1, bankShortName: 1, id: 1, identifier: 1 },
      { createdDate: 1 }
    );
    if (banks.length > 0) {
      const results = await BankAssignment.getCounter(countryId);
      const position = results % banks.length;
      const inx = position > 0 ? position - 1 : banks.length - 1;
      return { assignedBankId: banks[inx].id, identifier: banks[inx].identifier };
    } else {
      return { assignedBankId: null, identifier: null };
    }
  }

  /**
   *  Gets the current counter for this bank, meaning how many people from this country in this env
   *  have attempted to signup.
   *
   * @private
   * @param {string} countryId
   * @returns
   * @memberof BankAssignment
   */
  private static async getCounter(countryId: string): Promise<number> {
    const query = { country: countryId, environment: process.env.NODE_ENV };
    const update = { $inc: { counter: 1 } };
    const options = { new: true, upsert: true };
    const assignment = await BankAssignmentService.findOneAndUpdate(query, update, options);
    return assignment!.counter;
  }

  /**
   * Used to restart all counts for a particular environment and country.
   *
   * @private
   * @param {string} countryId
   * @returns
   * @memberof BankAssignment
   */
  private static async resetCounter(countryId: string): Promise<number> {
    const query = { country: countryId, environment: process.env.NODE_ENV };
    const update = { $set: { counter: 0 } };
    const options = { new: true, upsert: true };
    const assignment = await BankAssignmentService.findOneAndUpdate(query, update, options);
    return assignment!.counter;
  }
}
