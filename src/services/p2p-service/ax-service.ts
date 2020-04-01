import { injectable } from 'inversify';
import { IP2PTransferStrategy, IMeedP2P, IExternalP2P } from '../models/p2p-service/interface';

@injectable()
export abstract class P2PTransferService {
  protected strategy: IP2PTransferStrategy;

  constructor() {}

  public abstract async transfer(memberId: string, transferData: IMeedP2P | IExternalP2P): Promise<any>;

  public setTransferStrategy(strategy: IP2PTransferStrategy): void {
    this.strategy = strategy;
  }
}

@injectable()
export class AxP2PTransferService extends P2PTransferService {
  constructor() {
    super();
  }

  public async transfer(memberId: string, transferData: IMeedP2P | IExternalP2P): Promise<any> {
    return await this.strategy.transfer(memberId, transferData);
  }
}
