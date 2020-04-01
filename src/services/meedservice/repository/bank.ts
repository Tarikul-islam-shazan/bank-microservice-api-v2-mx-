import { IBank } from '../../models/meedservice';
import { BaseRepository } from './repository';
import { BankModel, IBankModel } from '../models/bank';

export class BankRepository extends BaseRepository<IBank, IBankModel> {
  constructor() {
    super(BankModel);
  }

  async findOne(condition: any, populates?: any): Promise<IBankModel> {
    const query = this.model.findOne(condition);
    if (populates) {
      query.populate(populates);
    }
    return await query.exec();
  }
}
