import { Request } from 'express';
import IAuthToken from './authToken';

export interface MeedRequest extends Request {
  token?: IAuthToken;
  bankId?: BankIdentifier;
}

export enum BankIdentifier {
  Axiomme = 'axiomme'
}
