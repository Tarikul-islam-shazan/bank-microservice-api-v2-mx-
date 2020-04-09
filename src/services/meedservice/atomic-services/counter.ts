import { CounterRepository } from '../repository/counter-repository';

export class CounterService {
  private static counterRepository = new CounterRepository();
  constructor() {}

  static async getCounter(counterFor: string): Promise<number> {
    const counterRes = await this.counterRepository.findOneAndUpdate(
      { counterFor },
      { $inc: { counterNumber: 1 } },
      { new: true, upsert: true }
    );
    return counterRes.counterNumber;
  }
}
