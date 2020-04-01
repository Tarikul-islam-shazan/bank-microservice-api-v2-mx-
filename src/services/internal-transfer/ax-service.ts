import { injectable, inject, named } from 'inversify';
import { TransferStrategy } from './strategy/ax-strategy';
import { ITransferStrategy, ITransfer } from '../models/internal-transfer/interface';

@injectable()
export abstract class TransferService {
  protected strategy: ITransferStrategy;

  constructor() {}

  public abstract async transfer(transfer: ITransfer): Promise<any>;
  public abstract async getTransfers(): Promise<ITransfer[]>;
  public abstract async modifyTransfer(transfer: ITransfer): Promise<ITransfer>;
  public abstract async deleteTransfer(transferId: string): Promise<boolean>;

  public setTransferStrategy(strategy: ITransferStrategy): void {
    this.strategy = strategy;
  }
}

@injectable()
export class AxxiomeTransferService extends TransferService {
  constructor() {
    super();
  }

  public async transfer(transfer: ITransfer): Promise<any> {
    return await this.strategy.transfer(transfer);
  }
  public async getTransfers(): Promise<ITransfer[]> {
    return await this.strategy.getTransfers();
  }

  public async modifyTransfer(transfer: ITransfer): Promise<ITransfer> {
    return await this.strategy.modifyTransfer(transfer);
  }
  public async deleteTransfer(transferId: string): Promise<boolean> {
    return await this.strategy.deleteTransfer(transferId);
  }
}
