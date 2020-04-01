import { IAuthorization } from '../../bank-auth/models/interface';

export interface IBankService {
  setAuthorizationService(auth: IAuthorization): void;
  getAuthorizationService(): IAuthorization;
}

export interface IBillPayStrategy {
  getAuthorizationService(): IAuthorization;

  addPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee>;
  getPayeeList(customerId: string, queries: any): Promise<IBillPayee[]>;
  getPayee(customerId: string, payeeId: string): Promise<IBillPayee>;
  deletePayee(customerId: string, payeeId: string): Promise<any>;
  editPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee>;

  createPayment(customerId: string, payment: IBillPayment): Promise<IBillPayment>;
  getPayments(customerId: string, queries: any): Promise<IBillPayment[]>;
  getPayment(customerId: string, paymentId: string): Promise<IBillPayment>;
  deletePayment(customerId: string, paymentId: string): Promise<IBillPayment>;
  editPayment(customerId: string, paymentId: string, payment: IBillPayment): Promise<IBillPayment>;

  getEBills(customerId: string): Promise<any>;

  createToken(customerId: string, billerTokenMeta: IBillerTokenMeta): Promise<any>;
}

export enum BillPayeeType {
  Individual = 'Individual',
  Company = 'Company'
}

export enum BillPaymentType {
  Electronic = 'Electronic',
  Check = 'Check'
}

export interface IBillPayee {
  payeeId?: string;
  fullName?: string;
  nickName?: string;
  phone?: string;
  type?: string;
  street?: string;
  postCode?: string;
  city?: string;
  state?: string;
  accountNumber?: string;
  paymentMethodType?: BillPaymentType;
}

export enum PaymentFrequency {
  Once = 'Once',
  Monthly = 'Monthly'
}

export interface IBillPayment {
  paymentId?: string;
  payeeId?: string;
  amount?: number;
  currency?: string;
  executionDate?: string;
  frequency?: PaymentFrequency;
  recurringPaymentDate?: string;
}

export enum BillPayProvider {
  IPAY = 'IPAY',
  Q2 = 'Q2'
}

export interface IBillerTokenMeta {
  memberEmail: string;
  memberStatus: string;
  memberType: string;
  inviterEmail: string;
}
