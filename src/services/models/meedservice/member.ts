import { IStaticData } from '.';
import { AccountLevel } from '../bank-onboarding/interface';

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
  GeneralInfoCompleted = 'general-info-completed',
  AddressInfoCompleted = 'address-info-completed',
  BeneficiaryInfoCompleted = 'beneficiary-info-completed',
  AccountLevelSelected = 'account-level-selected',
  PersonalInfoCompleted = 'personal-info-completed',
  FundSourceInfoCompleted = 'fund-source-info-completed',
  GovDisclosureCompleted = 'gov-disclosure-completed',
  IdentityConfirmationCompleted = 'identify-confirmation-completed',
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
  accountLevel?: AccountLevel;
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
