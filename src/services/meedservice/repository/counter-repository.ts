import { BaseRepository } from './repository';
import { ICounter } from '../../models/meedservice/counter';
import { ICounterModel, CounterModel } from '../models/counter';

export class CounterRepository extends BaseRepository<ICounter, ICounterModel> {
  constructor() {
    super(CounterModel);
  }
}
