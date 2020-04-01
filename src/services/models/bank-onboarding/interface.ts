import { IMember } from '../meedservice/member';
import { IBankService } from '../shared/interface';
import { IAccount } from '../account-service/interface';

export interface IOnboardingService extends IBankService {
  createLogin(username: string, credential: Credential): void;
  getIdentityQuestions(): Promise<IdentityQuestions>;
  setIdentityQuestionsAnswers(answers: IdentityAnswers): any;
  getTermsAndConditions(memberId: string): Promise<TncResponse>;
  // TODO: in future we will handle processId differently
  acceptTermsAndConditions(
    memberId: string,
    isTermsAccepted: boolean,
    processId?: string,
    corporateTncAccepted?: boolean | undefined
  ): Promise<ProductOnboardedResponse>;
  applyForAccount(memberId: string, application: BankApplication): Promise<IMember | IdentityQuestions>;
  fundAccount(memberId: string, funding: RegistrationFeeRequest): Promise<FundAccountResponse>;
}

export interface Credential {
  username: string;
  email: string;
  password: string;
}

interface Question {
  id: string;
  question: string;
}

interface Answer {
  id: string;
  answer: string;
}

/**
 * IdentityQuestions contain array of identity question
 *
 * @export
 * @interface IdentityQuestions
 */
export interface IdentityQuestions {
  questions: IdentityQuestion[];
}

interface IdentityQuestion extends Question {
  availableAnswers: Answer;
}

/**
 * contain array of identity answer
 *
 * @export
 * @interface IdentityAnswers
 */
export interface IdentityAnswers {
  identityAnswers: Answer[];
}

/**
 * Terms and conditions
 *
 * @export
 * @interface TncResponse
 */
export interface TncResponse {
  showCorporateTnc: boolean;
  processId: string;
  termsAndConditions: TncDocument[];
}

export interface TncDocument {
  title: string;
  documents: Document[];
}

interface Document {
  title: string;
  pdf: string;
}

enum AccountType {
  DDA = 'DDA',
  SSA = 'SSA',
  LOC = 'LOC'
}

export interface AccountId {
  accountNumber: string;
  accountType: AccountType;
}

export interface ProductOnboardedResponse {
  accounts: IAccount[];
}

interface IMemberApplication {
  email: string;
}

export interface IScannedIdData {
  reference: string;
  extractionMethod: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  addressLine: string;
  postCode: string;
  city: string;
  subdivision: string;
  country: string;
  identificationType: string;
  idNumber: string;
  issuer: string;
  issuingDate: Date;
  issuingCountry: string;
  expiryDate: Date;
}

export interface BankApplication {
  memberApplication: IMemberApplication;
  scannedIdData: IScannedIdData;
}

export interface USMemberInfo extends IMemberApplication {
  email: string;
  prefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  mobilePhone: string;
  workPhone: string;
  zipCode: string;
  state: string;
  identityType: IdentityType;
  identityNumber: string;
  socialSecurityNo: string;
  country: string;
  occupation: Occupations;
  isRelatedToArmedForces: ArmedForceRelation;
  armedForcesMemberFirstName: string;
  armedForcesMemberLastName: string;
  armedForcesSocialSecurityPin: string;
  armedForcesDob: string;
  sourceOfIncome: SourceOfIncomes;
  monthlyWithdrawal: MonthlyTransactionRange;
  monthlyDeposit: MonthlyTransactionRange;
  monthlyIncome: string;
  workPhoneExtension: string;
}

export enum ArmedForceRelation {
  Member = 'member',
  Dependent = 'dependent',
  Neither = 'neither'
}

export enum IdentityType {
  DrivingLicence = 'DrivingLicence',
  Passport = 'Passport',
  MilitaryId = 'MilitaryId',
  StateId = 'StateId'
}

enum MonthlyTransactionRange {
  RANGE_0_1T = '0-1T',
  RANGE_1T_5T = '1T-5T',
  RANGE_5T_15T = '5T-15T',
  RANGE_GT_15T = 'GT-15T'
}

enum Occupations {
  ManagementBusinessFinancial = 'ManagementBusinessFinancial',
  ComputerMathematical = 'ComputerMathematical',
  ArchitectureEngineering = 'ArchitectureEngineering',
  Science = 'Science',
  Legal = 'Legal',
  Education = 'Education',
  Arts = 'Arts',
  HealthcarePractitioners = 'HealthcarePractitioners',
  HealthcareSupport = 'HealthcareSupport',
  ProtectiveService = 'ProtectiveService',
  FoodPrep = 'FoodPrep',
  BuildingCleaningMaintenance = 'BuildingCleaningMaintenance',
  PersonalCare = 'PersonalCare',
  Sales = 'Sales',
  Office = 'Office',
  FarmingFishingForestry = 'FarmingFishingForestry',
  ConstructionExtraction = 'ConstructionExtraction',
  InstallationMaintenanceRepair = 'InstallationMaintenanceRepair',
  Production = 'Production',
  Transportation = 'Transportation',
  Military = 'Military',
  Fire = 'Fire',
  Law = 'Law',
  Homemaker = 'Homemaker',
  Student = 'Student',
  PrivateInvestor = 'PrivateInvestor',
  RealEstate = 'RealEstate',
  Religious = 'Religious',
  Retired = 'Retired',
  Unemployed = 'Unemployed'
}

enum SourceOfIncomes {
  SalaryWages = 'SalaryWages',
  Inheritance = 'Inheritance',
  PropertyCompanySale = 'PropertyCompanySale',
  Investments = 'Investments',
  DivorceSettlement = 'DivorceSettlement',
  Other = 'Other'
}

export interface RegistrationFee extends AccountId {
  amount: number;
}

export enum RegistrationFeePaymentType {
  ACH = 'ACH',
  ECHECK = 'ECHECK',
  CREDITCARD = 'CREDITCARD',
  DEBITCARD = 'DEBITCARD'
}

export interface RegistrationFeeRequest {
  totalAmount: number;
  deposits: RegistrationFee[];
  paymentMethod: RegistrationFeePaymentType;
  paymentTrackingId: string;
}

export interface FundAccountResponse {
  paymentTrackingID: string;
}
