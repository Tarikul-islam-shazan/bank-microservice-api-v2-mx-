import { injectable, inject, named } from 'inversify';
import querystring from 'querystring';
import moment from 'moment';

import {
  IBillPayee,
  IBillPayment,
  PaymentFrequency,
  IBillPayStrategy,
  IBillerTokenMeta
} from '../../../models/bill-pay/interface';
import { IAccountService } from '../../../models/account-service/interface';
import { AxErrorMapper } from '../../../../utils/error-mapper/axError';
import { IAuthorization } from '../../../bank-auth/models/interface';
import { BankIdentifier } from '../../../../interfaces/MeedRequest';
import { AxRequestMapper, AxResponseMapper } from '../../mappers';
import { HTTPError } from '../../../../utils/httpErrors';
import { AxBillErrMapper } from '../../errors/ax-errors';
import { TYPES } from '../../../../utils/ioc/types';
import { BillPayStrategy } from '../bill-strategy';
import { MeedAxios } from '../../../../utils/api';
import config from '../../../../config/config';

@injectable()
export class AxIpayStrategy extends BillPayStrategy implements IBillPayStrategy {
  @inject(TYPES.AxAccountService)
  @named(BankIdentifier.Invex)
  private accountService: IAccountService;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  //#region Payee
  /**
   * Add a new payee
   * @param {string} customerId
   * @param {IBillPayee} payee
   * @returns {Promise<IBillPayee>}
   * @memberof AxBillPayService
   */
  async addPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee> {
    this.accountService.setAuthorizationService(this.auth);
    const accounts = await this.accountService.getAccountInfo();
    try {
      const addPayeeRequest = AxRequestMapper.addPayee({ ...payee, ...accounts });
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payees`,
        { ...addPayeeRequest },
        headers
      );
      return AxResponseMapper.payeeDetails(response.data);
    } catch (error) {
      const otpErr = AxBillErrMapper.additionalOTPResponse(error);
      if (otpErr.otpID) {
        return otpErr;
      }
      throw new HTTPError(otpErr.message, otpErr.errorCode, otpErr.httpCode);
    }
  }

  /**
   * Get list of payees of a customer
   * @param customerId
   */
  async getPayeeList(customerId: string, queries: any): Promise<IBillPayee[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payees?${querystring.encode(queries)}`,
        headers
      );
      return AxResponseMapper.getPayeeList(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Get a payee details
   * @param {string} customerId
   * @param {string} payeeId
   * @returns {Promise<IBillPayee>}
   * @memberof AxBillPayService
   */
  async getPayee(customerId: string, payeeId: string): Promise<IBillPayee> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payees/${payeeId}`,
        headers
      );
      return AxResponseMapper.payeeDetails(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Delete a payee
   * @param {string} customerId
   * @param {string} payeeId
   * @returns {Promise<any>}
   * @memberof AxBillPayService
   */
  async deletePayee(customerId: string, payeeId: string): Promise<any> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().delete(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payees/${payeeId}`,
        headers
      );
      return response.data;
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Edit a payee
   * @param {string} customerId
   * @param {IBillPayee} payee
   * @returns {Promise<IBillPayee>}
   * @memberof AxBillPayService
   */
  async editPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee> {
    try {
      const editPayeeRequest = AxRequestMapper.editPayee({ ...payee });
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().put(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payees/${payee.payeeId}`,
        { ...editPayeeRequest },
        headers
      );
      return AxResponseMapper.payeeDetails(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region Payment
  /**
   * Add a new payment
   *
   * @param {string} customerId
   * @param {IBillPayment} payment
   * @returns {Promise<IBillPayment>}
   * @memberof AxBillPayService
   */
  async createPayment(customerId: string, payment: IBillPayment): Promise<IBillPayment> {
    // if payment is monthly then set the recurring payment date and change frequency format
    // otherwise we dont need recurring infos
    if (payment.frequency === PaymentFrequency.Monthly) {
      payment.frequency = `IntrvlMnthDay:1:${moment(payment.executionDate).date()}` as any;
      payment.recurringPaymentDate = payment.executionDate;
    } else {
      delete payment.frequency;
    }

    try {
      const createPaymentRequest = AxRequestMapper.createPayment(payment);
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payments`,
        { ...createPaymentRequest },
        headers
      );
      return AxResponseMapper.paymentDetails(response.data);
    } catch (error) {
      const otpErr = AxBillErrMapper.additionalOTPResponse(error);
      if (otpErr.otpID) {
        return otpErr;
      }
      throw new HTTPError(otpErr.message, otpErr.errorCode, otpErr.httpCode);
    }
  }

  /**
   * Get payment list
   * @param {string} customerId
   * @param {*} queries
   * @returns {Promise<IBillPayment[]>}
   * @memberof AxBillPayService
   */
  async getPayments(customerId: string, queries: any): Promise<IBillPayment[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payments?${querystring.encode(
          queries
        )}`,
        headers
      );
      return AxResponseMapper.getPayments(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Get a payment details
   * @param {string} customerId
   * @param {string} paymentId
   * @returns {Promise<IBillPayment>}
   * @memberof AxBillPayService
   */
  async getPayment(customerId: string, paymentId: string): Promise<IBillPayment> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payments/${paymentId}`,
        headers
      );
      return AxResponseMapper.paymentDetails(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Edit a payment
   * @param {string} customerId
   * @param {string} paymentId
   * @param {IBillPayment} payment
   * @returns {Promise<IBillPayment>}
   * @memberof AxBillPayService
   */
  async editPayment(customerId: string, paymentId: string, payment: IBillPayment): Promise<IBillPayment> {
    try {
      const paymentToEdit = AxRequestMapper.editPayment(payment);
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().put(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payments/${paymentId}`,
        { ...paymentToEdit },
        headers
      );
      return AxResponseMapper.paymentDetails(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxBillErrMapper.badRequestError(AxErrorMapper.getHttpCode(error), error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Delete a payment details
   * @param {string} customerId
   * @param {string} paymentId
   * @returns {Promise<IBillPayment>}
   * @memberof AxBillPayService
   */
  async deletePayment(customerId: string, paymentId: string): Promise<IBillPayment> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().delete(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/payments/${paymentId}`,
        headers
      );
      return AxResponseMapper.paymentDetails(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region eBill
  /**
   * @param {string} customerId
   * @returns {Promise<any>}
   * @memberof AxBillPayService
   */
  async getEBills(customerId: string): Promise<any> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/billpayments/${config.api.axxiome.version}/billPayments/${customerId}/ebills`,
        headers
      );
      return response.data;
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region Token
  /**
   * @param {string} customerId
   * @returns {Promise<any>}
   * @memberof AxBillPayService
   */
  async createToken(customerId: string, billerTokenMeta: IBillerTokenMeta): Promise<any> {
    throw new HTTPError('Not Implemented', '501', 501);
  }
  //#endregion
}
