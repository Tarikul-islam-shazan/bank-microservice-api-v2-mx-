import { injectable, inject, named } from 'inversify';
import { IBillPayee, IBillPayment, IBillPayStrategy, IBillerTokenMeta } from '../models/bill-pay/interface';
import { TYPES } from '../../utils/ioc/types';

@injectable()
export abstract class BillPayService {
  protected strategy: IBillPayStrategy;

  constructor(injectedStrategy: IBillPayStrategy) {
    this.strategy = injectedStrategy;
  }

  //#region Payee
  public abstract async addPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee>;
  public abstract async getPayeeList(customerId: string, queries: any): Promise<IBillPayee[]>;
  public abstract async getPayee(customerId: string, payeeId: string): Promise<IBillPayee>;
  public abstract async deletePayee(customerId: string, payeeId: string): Promise<any>;
  public abstract async editPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee>;
  //#endregion

  //#region Payment
  public abstract async createPayment(customerId: string, payment: IBillPayment): Promise<IBillPayment>;
  public abstract async getPayments(customerId: string, queries: any): Promise<IBillPayment[]>;
  public abstract async getPayment(customerId: string, paymentId: string): Promise<IBillPayment>;
  public abstract async editPayment(customerId: string, paymentId: string, payment: IBillPayment);
  public abstract async deletePayment(customerId: string, paymentId: string): Promise<IBillPayment>;
  //#endregion

  //#region eBill
  public abstract async getEBills(customerId: string): Promise<any>;
  //#endregion

  //#region Token
  public abstract async createToken(customerId: string, billerTokenMeta: IBillerTokenMeta): Promise<any>;
  //#endregion

  public setAuth(headers: any, token: any): void {
    this.strategy.getAuthorizationService().setHeadersAndToken(headers, token);
  }
}

@injectable()
class AxBillPayService extends BillPayService {
  constructor(@inject(TYPES.BillPayStrategy) injectedStrategy: IBillPayStrategy) {
    super(injectedStrategy);
  }

  //#region Payee
  async addPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee> {
    return this.strategy.addPayee(customerId, payee);
  }

  async getPayeeList(customerId: string, queries: any): Promise<IBillPayee[]> {
    return this.strategy.getPayeeList(customerId, queries);
  }

  async getPayee(customerId: string, payeeId: string): Promise<IBillPayee> {
    return this.strategy.getPayee(customerId, payeeId);
  }

  async deletePayee(customerId: string, payeeId: string): Promise<any> {
    return this.strategy.deletePayee(customerId, payeeId);
  }

  async editPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee> {
    return this.strategy.editPayee(customerId, payee);
  }
  //#endregion

  //#region Payment
  async createPayment(customerId: string, payment: IBillPayment): Promise<IBillPayment> {
    return this.strategy.createPayment(customerId, payment);
  }

  async getPayments(customerId: string, queries: any): Promise<IBillPayment[]> {
    return this.strategy.getPayments(customerId, queries);
  }

  async getPayment(customerId: string, paymentId: string): Promise<IBillPayment> {
    return this.strategy.getPayment(customerId, paymentId);
  }

  async editPayment(customerId: string, paymentId: string, payment: IBillPayment): Promise<IBillPayment> {
    return this.strategy.editPayment(customerId, paymentId, payment);
  }

  async deletePayment(customerId: string, paymentId: string): Promise<IBillPayment> {
    return this.strategy.deletePayment(customerId, paymentId);
  }
  //#endregion

  //#region eBill
  async getEBills(customerId: string): Promise<any> {
    return this.strategy.getEBills(customerId);
  }
  //#endregion

  //#region Token
  async createToken(customerId: string, billerTokenMeta: IBillerTokenMeta): Promise<any> {
    return this.strategy.createToken(customerId, billerTokenMeta);
  }
  //#endregion
}

export { AxBillPayService };
