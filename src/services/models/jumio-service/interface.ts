import { IBankService } from '../shared/interface';

export interface IJumioService extends IBankService {
  webInitiate(jumioData: JumioWebInitiateRequest): Promise<JumioWebInitiateResponse>;
  verification(memberId: string, varificationData: any): Promise<any>;
  retrieveDetails(reference: string): Promise<IJumioRetrieveDetails>;
}

export interface JumioWebInitiateRequest {
  customerInternalReference: string;
  userReference: string;
  callbackUrl: string;
}

export interface JumioWebInitiateResponse {
  timestamp: string;
  transactionReference: string;
  redirectUrl: string;
}

export interface IJumioRetrieveDetails {
  timestamp: string;
  scanReference: string;
  document: object;
  transaction: object;
  verification?: object;
  facemap?: object;
}
