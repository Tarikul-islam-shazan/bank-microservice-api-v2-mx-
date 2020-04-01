import { BankRepository } from '../repository/bank';
import { IBank } from '../../models/meedservice';

export class BankService {
  private static bankRepository = new BankRepository();
  constructor() {}

  //#region bank Crud Operations
  /**
   *  Finds and returns a bank based on the id.
   *
   * @static
   * @param {string} bankId
   * @returns {Promise<IBank>}
   * @transitionof MeedService
   */
  static async find(condition: any, projection: any, sort: any): Promise<IBank[]> {
    const retVal = await this.bankRepository.find(condition, projection, sort);
    return retVal as IBank[];
  }

  /**
   * @static
   * @param {*} condition
   * @returns {Promise<IBank>}
   * @memberof BankService
   */
  static async findOne(condition: any, populates?: any): Promise<IBank> {
    const retVal = await this.bankRepository.findOne(condition, populates);
    return retVal as IBank;
  }
}
