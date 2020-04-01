import { IAuthorization } from '../../bank-auth/models/interface';

export interface IBankService {
  setAuthorizationService(auth: IAuthorization): void;
  getAuthorizationService(): IAuthorization;
}

export interface ITransferStrategy {
  transfer(transfer: ITransfer): Promise<any>;
  getTransfers(): Promise<ITransfer[]>;
  modifyTransfer(transfer: ITransfer): Promise<ITransfer>;
  deleteTransfer(transferId: string): Promise<boolean>;
  getAuthorizationService(): IAuthorization;
}

export interface ITransfer {
  transferId?: string;
  debtorAccount: string;
  creditorAccount: string;
  amount: 0;
  currency: string;
  notes: string;
  transferDate: string;
  transferType: TransferType;
  previousTransferType?: TransferType;
  frequency: TransferFrequency;
}

export enum TransferFrequency {
  Once = 'Once',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export enum TransferType {
  Immediate = 'Immediate',
  Scheduled = 'Scheduled',
  Recurring = 'Recurring'
}
