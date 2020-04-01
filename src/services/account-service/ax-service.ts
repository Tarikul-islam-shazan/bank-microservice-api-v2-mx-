import { injectable, inject, named } from 'inversify';
import { ResponseMapper, RequestMapper } from './mappers';
import { MeedAxios } from '../../utils/api';
import { HTTPError } from '../../utils/httpErrors';
import { IAuthorization } from '../bank-auth/models/interface';
import {
  IAccountService,
  IAccount,
  ITransaction,
  ITransactionQueries,
  IStatement,
  IStatementDetails,
  ISweepState
} from '../models/account-service/interface';
import { AxErrorMapper } from '../../utils/error-mapper/axError';
import { TYPES } from '../../utils/ioc/types';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import config from '../../config/config';
import _ from 'lodash';
import moment from 'moment';
const querystring = require('querystring');
import { AxAccountError } from './errors';

@injectable()
class AccountService implements IAccountService {
  private auth: IAuthorization;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Axiomme) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async getAccountSummary(): Promise<IAccount[]> {
    try {
      // getting required HTTP headers from bank auth service
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(`/account/2.3.0/accountsummary`, headers);
      return ResponseMapper.accountSummaryMapper(response);
    } catch (err) {
      // TODO: check this type of format of passing to parameter
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getTransactions(accountId: string, query: Partial<ITransactionQueries> = {}): Promise<ITransaction[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const queries = RequestMapper.transactionQueries(query);

      // can't use moment js inside jsonata mapper
      if (query.dateFrom) {
        queries.fromBookingDateTime = moment.utc(query.dateFrom, 'MM/DD/YYYY').toISOString();
      }

      // as above, can't use moment js inside jsonata mapper
      if (query.dateTo) {
        queries.toBookingDateTime = moment.utc(query.dateTo + ' 23:59:59', 'MM/DD/YYYY HH:mm:ss').toISOString();
      }

      const response = await MeedAxios.getAxiosInstance().get(
        `/account/2.3.0/accounts/${accountId}/transactions?${querystring.encode(queries)}`,
        headers
      );

      return ResponseMapper.transactionsDetailsMapper(response);
    } catch (err) {
      if (err.response.status === 404) {
        return ResponseMapper.transactionsDetailsMapper({});
      }
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getStatements(accountId: string): Promise<IStatement[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `retrieveAccountStatements/${config.api.axxiome.version}/accounts/${accountId}/statements`,
        headers
      );
      return ResponseMapper.statementsMapper(response);
    } catch (err) {
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getStatementDetails(accountId: string, statementId: string): Promise<IStatementDetails> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `retrieveAccountStatements/${config.api.axxiome.version}/accounts/${accountId}/statements/${statementId}/file`,
        headers
      );
      return ResponseMapper.statementDetailsMapper(response);
    } catch (err) {
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getAccountInfo(): Promise<IAccount> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(`/account/2.3.0/accounts`, headers);
      // Note: if we need this in bff, we need to add a response mapper
      return response.data;
    } catch (err) {
      const { message, errorCode, httpCode } = AxErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async getSweepState(): Promise<ISweepState> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/sweeping/${config.api.axxiome.version}/sweepings`,
        headers
      );
      const state = ResponseMapper.sweepStateMapper(response);
      return state;
    } catch (err) {
      const { message, errorCode, httpCode } = AxAccountError.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async updateSweepState(state: ISweepState): Promise<ISweepState> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().put(
        `/sweeping/${config.api.axxiome.version}/sweepings/${state.state}`,
        {},
        headers
      );
      return state;
    } catch (err) {
      const { message, errorCode, httpCode } = AxAccountError.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export { AccountService };
