import { IStaticData } from '.';

export enum ApplicationProgress {
  EmailRegistered = 'email-registered',
  InviterChosen = 'inviter-chosen',
  CountrySelected = 'country-selected',
  BankIdentified = 'bank-identified',
  EmailVerified = 'email-verified',
  CredentialsCreated = 'credentials-created',
  JumioScanStarted = 'jumio-scan-started',
  JumioScanFailed = 'jumio-scan-failed',
  JumioScanSucceeded = 'jumio-scan-succeeded',
  JumioVerifyApproved = 'jumio-verify-approved',
  JumioVerifyDenied = 'jumio-verify-denied',
  BankApplicationSubmitted = 'bank-application-submitted',
  IdentityQuestionsViewed = 'identity-questions-viewed',
  IdentityQuestionsAnswered = 'identity-questions-answered',
  ProductOnboarded = 'product-onboarded',
  TermsAndConditionAccepted = 'tnc-accepted',
  AccountFunded = 'account-funded',
  DirectDeposit = 'direct-deposit-performed',
  RegistrationCompleted = 'registration-completed'
}

export enum ApplicationStatus {
  Started = 'application-started',
  Completed = 'application-completed',
  OnHold = 'application-onhold',
  Denied = 'application-denied'
}

export enum AccountStatus {
  Opened = 'account-opened',
  Closed = 'account-closed',
  InProgress = 'account-in-progress'
}

export enum MemberType {
  Individual = 'individual',
  Corporate = 'corporate'
}

export interface IMember {
  id?: any;
  email?: string;
  priorEmails?: [string];
  inviter?: IMember['id'] | string | null;
  inviterCode?: string;
  inviterEmail?: string;
  corporateTncAccepted?: boolean;
  nickname?: string;
  applicationStatus?: ApplicationStatus;
  applicationProgress?: ApplicationProgress;
  accountStatus?: AccountStatus;
  memberType?: MemberType;
  bank?: string | any;
  country?: string;
  username?: string;
  memberStatusHistory?: [string];
  customerId?: string;
  language?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface ILoginData {
  member: IMember;
  staticData: IStaticData[];
}
