import { IAuthorization } from '../../bank-auth/models/interface';
import { IAccount } from '../account-service/interface';

export interface IP2PTransferStrategy {
  transfer(memberId: string, transferData: IMeedP2P | IExternalP2P): Promise<any>;
  getAuthorizationService(): IAuthorization;
}

export interface IP2PTransfer {
  senderEmail?: string;
  receiverEmail?: string;
  senderAccountId?: string;
  amount?: number;
  message?: string;
  transferType?: P2PTransferType;
  trackingId?: string;
  confirmationCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMeedP2P extends IP2PTransfer {
  otpId?: string;
}

export interface IExternalP2P extends IP2PTransfer {
  receiverCustomerId?: string;
  receiverCurrency?: string;
  sharedSecret?: string;
}

export enum P2PTransferType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}
