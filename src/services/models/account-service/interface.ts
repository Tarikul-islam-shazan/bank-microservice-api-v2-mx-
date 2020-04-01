import { IBankService } from '../internal-transfer/interface';
export interface IAccountService extends IBankService {
  getAccountSummary(): Promise<IAccount[]>;
  getTransactions(accountId: string, query: Partial<ITransactionQueries>): Promise<ITransaction[]>;
  getStatements(accountId: string): Promise<IStatement[]>;
  getStatementDetails(accountId: string, statementId: string): Promise<IStatementDetails>;
  getAccountInfo(): Promise<IAccount>;
  getSweepState(): Promise<ISweepState>;
  updateSweepState(state: ISweepState): Promise<ISweepState>;
}

export enum SweepState {
  Activate = 'activate',
  Deactivate = 'deactivate'
}

export interface ISweepState {
  state: SweepState;
}

export interface ITransactionQueries {
  dateFrom: string;
  dateTo: string;
  keywords: string;
  includeCredits: boolean;
  includeDebits: boolean;
  amountFrom: number;
  amountTo: number;
}

export interface ITransaction {
  transactionType: string;
  amount: number;
  notes: string;
  dateTime: string;
  referenceNumber: string;
  fromAccount: string;
  toAccount: string;
  status: TransactionStatus;
  city: string;
  state: string;
  country: string;
}

enum TransactionStatus {
  Pending = 'Pending',
  Booked = 'Booked'
}
// Adding creditLimitExceeded for the daily/weekly/monthly limit
export interface IAccount {
  accountId?: string;
  accountNickname?: string;
  status?: AccountStatus;
  accountLock?: AccountLock;
  accountNumber: string;
  accountType: AccountType;
  balanceOwed: number;
  currentBalance: number;
  holdBalance: number;
  availableBalance: number;
  minimumDue?: number;
  routingNumber: string;
  isHold?: boolean;
  interestEarned?: number;
  creditLimitExceeded: boolean;
}

export enum AccountType {
  DDA = 'DDA',
  SSA = 'SSA',
  LOC = 'LOC'
}

export enum AccountStatus {
  Active = 'Active',
  Frozen = 'Frozen',
  CreditsOnly = 'CreditsOnly',
  Inactive = 'Inactive',
  Dormant = 'Dormant',
  ChargeOff = 'ChargeOff'
}

export enum AccountLock {
  DeathOfAccountHolder = 'DeathOfAccountHolder',
  ServicingOfAccountHolder = 'ServicingOfAccountHolder',
  ManualSignatureCheck = 'ManualSignatureCheck',
  Garnishment = 'Garnishment',
  OFACFailed = 'OFACFailed',
  MLACheck = 'MLACheck',
  FreezeCardInDDAAccount = 'FreezeCardInDDAAccount',
  Customer = 'Customer',
  PaymentFormManualProcessing = 'PaymentFormManualProcessing',
  NoticeOnRemittanceAmount = 'NoticeOnRemittanceAmount',
  AccountOpening = 'AccountOpening',
  CourtOrderGarnishment = 'CourtOrderGarnishment',
  Fraud = 'Fraud',
  PendingAccountClosure = 'PendingAccountClosure',
  DebitCard = 'DebitCard',
  DebitCardRenewal = 'DebitCardRenewal',
  DebitCardsAllLocked = 'DebitCardsAllLocked',
  PaymentFormQualified = 'PaymentFormQualified',
  DebitMemoSEPA = 'DebitMemoSEPA',
  Mandate = 'Mandate',
  PaymentRecipient = 'PaymentRecipient',
  BearerCheckAmount = 'BearerCheckAmount',
  OrderCheckAmount = 'OrderCheckAmount',
  DebitMemoAmount = 'DebitMemoAmount',
  TransferOrder = 'TransferOrder',
  MandateUCI = 'MandateUCI',
  Dunning = 'Dunning',
  Loan = 'Loan',
  Rescission = 'Rescission',
  Disbursement = 'Disbursement',
  PaymentPlanChange = 'PaymentPlanChange',
  Skip = 'Skip',
  LoanPayoff = 'LoanPayoff',
  Waiver = 'Waiver',
  FollowUpActionsRescission = 'FollowUpActionsRescission',
  FollowUpActionsForNotice = 'FollowUpActionsForNotice',
  FollowUpActionsForRollover = 'FollowUpActionsForRollover',
  Technical = 'Technical',
  ParticipantAccount = 'ParticipantAccount',
  ParticipantPrenote = 'ParticipantPrenote',
  Frozen = 'Frozen',
  CreditsOnly = 'CreditsOnly'
}

export interface IStatement {
  statementId: number;
  accountId: string;
  statementDate: string;
}

export interface IStatementDetails {
  documents: any;
  type: string;
}

// Below is datamodel from axiomme which we have to model on our side:
// {
//   "Data": {
//     "Account": [
//       {
//         "AccountId": "string",
//         "Currency": "string",
//         "AccountType": "Business",
//         "AccountSubType": "DDA",
//         "Status": "Active",
//         "Nickname": "string",
//         "Balance": [
//           {
//             "Type": "currentBalance",
//             "Amount": {
//               "Amount": "string",
//               "Currency": "string"
//             }
//           }
//         ],
//         "AccessLimit": [
//           {
//             "Type": "DailyCounterLimit",
//             "LimitAmount": {
//               "Amount": "string",
//               "Currency": "string"
//             },
//             "ActualAmount": {
//               "Amount": "string",
//               "Currency": "string"
//             },
//             "LimitCounter": 0,
//             "ActualCounter": 0,
//             "DateTime": "string"
//           }
//         ],
//         "AccountLocks": [
//           {
//             "Code": "DeathOfAccountHolder",
//             "Description": "string"
//           }
//         ],
//         "Account": [
//           {
//             "SchemeName": "string",
//             "Identification": "string",
//             "Name": "string",
//             "SecondaryIdentification": "string"
//           }
//         ]
//       }
//     ]
//   }
// }
