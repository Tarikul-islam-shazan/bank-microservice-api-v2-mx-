import { IAuthorization } from '../../bank-auth/models/interface';
import { MeedRequest } from '../../../interfaces/MeedRequest';

export interface IBankService {
  setAuthorizationService(auth: IAuthorization): void;
  getAuthorizationService(): IAuthorization;
}

export interface IDepositService extends IBankService {
  depositFund(req: DepositFund, memberId: string): Promise<DepositFundRes>;
  depositMoney(req: any): Promise<any>;
  depositCheck(req: any, files: any): Promise<any>;
}

export interface DepositFundRes {
  message: string;
}

export interface DepositFund {
  email: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  accountNumber: string;
  bankRoutingNumber: string;
  businessName: string;
}

export interface DepositCheck {
  amount: string;
  currency: string;
  depositDate: string;
  notes: string;
  accountNumber: string;
  deviceKey: string;
  deviceDescription: string;
  businessName: string;
  identification?: string;
  secondaryIdentification?: string;
}

export interface DepositCheckResp {
  depositCheckConfirmationNumber: string;
  processingStatus: boolean;
}

export interface DepositMoney {
  checkingAmount: string;
  currency: string;
  paymentMethod: string;
  paymentTrackingID: string;
  savingAmount: string;
  totalAmount: string;
}

export interface DepositMoneyResp {
  processId: string;
}
