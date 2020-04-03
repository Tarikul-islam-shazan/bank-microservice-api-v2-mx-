import { injectable, inject, named } from 'inversify';
import axios from 'axios';

import { IBillPayee, IBillPayment, IBillPayStrategy, IBillerTokenMeta } from '../../../models/bill-pay/interface';
import { IAccountService } from '../../../models/account-service/interface';
import { AxErrorMapper } from '../../../../utils/error-mapper/axError';
import { IAuthorization } from '../../../bank-auth/models/interface';
import { BankIdentifier } from '../../../../interfaces/MeedRequest';
import { HTTPError } from '../../../../utils/httpErrors';
import { TYPES } from '../../../../utils/ioc/types';
import { BillPayStrategy } from '../bill-strategy';
import config from '../../../../config/config';

@injectable()
export class AxQ2Strategy extends BillPayStrategy implements IBillPayStrategy {
  @inject(TYPES.AxAccountService)
  @named(BankIdentifier.Invex)
  private accountService: IAccountService;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  //#region Payee
  async addPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async getPayeeList(customerId: string, queries: any): Promise<IBillPayee[]> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async getPayee(customerId: string, payeeId: string): Promise<IBillPayee> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async deletePayee(customerId: string, payeeId: string): Promise<any> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async editPayee(customerId: string, payee: IBillPayee): Promise<IBillPayee> {
    throw new HTTPError('Not Implemented', '501', 501);
  }
  //#endregion

  //#region Payment
  async createPayment(customerId: string, payment: IBillPayment): Promise<IBillPayment> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async getPayments(customerId: string, queries: any): Promise<IBillPayment[]> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async getPayment(customerId: string, paymentId: string): Promise<IBillPayment> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async editPayment(customerId: string, paymentId: string, payment: IBillPayment): Promise<IBillPayment> {
    throw new HTTPError('Not Implemented', '501', 501);
  }

  async deletePayment(customerId: string, paymentId: string): Promise<IBillPayment> {
    throw new HTTPError('Not Implemented', '501', 501);
  }
  //#endregion

  //#region eBill
  async getEBills(customerId: string): Promise<any> {
    throw new HTTPError('Not Implemented', '501', 501);
  }
  //#endregion

  //#region Token
  async createToken(customerId: string, billerTokenMeta: IBillerTokenMeta): Promise<any> {
    try {
      const apiBody = {
        meta: billerTokenMeta,
        identifier: customerId,
        nonce: false
      };
      const response = await axios.post(
        `${config.billerDirectHelper.apiHost}/client/create-token`,
        { ...apiBody },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.billerDirectHelper.apiKey}`
          }
        }
      );

      const { connectSSOUrl, cardSwapSSOUrl, billerDirectSSOUrl } = config.billerDirectHelper;
      return { token: response.data.token, connectSSOUrl, cardSwapSSOUrl, billerDirectSSOUrl };
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion
}
