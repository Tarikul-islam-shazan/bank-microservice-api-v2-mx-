import { BillPayProvider } from '../bill-pay/interface';
import { BankIdentifier } from '../../../interfaces/MeedRequest';

export interface IBank {
  id?: any;
  name?: string;
  shortName?: string;
  apiUrl?: string;
  currency?: string;
  country?: string;
  identifier: BankIdentifier;
  banksSharingAtms: string[];
  supportedLocales: string[];
  billPayProvider?: BillPayProvider;
}

export interface IBankAssignment {
  country: string;
  environment: string;
  counter: number;
}

export interface IBankAssignmentResult {
  assignedBankId: string | null;
  identifier: string;
}
