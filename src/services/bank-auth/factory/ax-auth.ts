import httpContext from 'express-http-context';
import { MeedRequest } from '../../../interfaces/MeedRequest';
import { MeedAxios } from '../../../utils/api';
import config from '../../../config/config';
import { IAuthorization } from '../models/interface';
import { HTTPError } from '../../../utils/httpErrors';
import IAuthToken from '../../../interfaces/authToken';
import logger from '../../../utils/logger';
import _ from 'lodash';
import { BankAuthCodes } from '../errors/bankAuthErrors';
import { injectable } from 'inversify';

@injectable()
export class AxiommeAuthorization implements IAuthorization {
  private reqBody = 'grant_type=client_credentials';
  private basicAuthUserName = config.api.axxiome.username;
  private basicAuthPassword = config.api.axxiome.password;
  private headers: any;
  private token?: IAuthToken;

  // constructor(req: MeedRequest) {
  //   console.log('here');
  //   this.headers = req.headers;
  //   this.token = req.token;
  // }

  constructor() {}

  public setToken(req: MeedRequest) {
    this.token = {
      ...this.token,
      ...req.token
    };
  }

  public isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  private getBase64(text: string) {
    return Buffer.from(text).toString('base64');
  }

  public setHeader(req: MeedRequest) {
    this.headers = req.headers;
  }

  public getMeedHeaders() {
    return this.headers;
  }

  public setHeadersAndToken(headers: any, token?: IAuthToken) {
    this.headers = headers;
    if (token) {
      this.token = {
        ...this.token,
        ...token
      };
    }
  }

  /**
   *  Returns access token used to access Axiomme API's.
   *
   * @returns {string}
   * @memberof AxiommeAuth
   */
  public async getAccessToken(): Promise<string> {
    const requestHeader = {
      headers: {
        Authorization: 'Basic ' + this.getBase64(this.basicAuthUserName + ':' + this.basicAuthPassword),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    try {
      const tokenResponse = await MeedAxios.getAxiosInstance().post('/token', this.reqBody, requestHeader);
      return tokenResponse.data.access_token;
    } catch (error) {
      const { message, errorCode, httpCode } = BankAuthCodes.UNABLE_GET_ACCESS_TOKEN;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async getBankHeaders(): Promise<object> {
    if (!this.headers) {
      const { message, errorCode, httpCode } = BankAuthCodes.HEADERS_NOT_SET;
      throw new HTTPError(message, errorCode, httpCode);
    }
    const headers = {
      Authorization: ''
    };
    if (this.headers['meedbankingclub-username']) {
      this.headers['X-axxiome-digital-user'] = this.headers['meedbankingclub-username'];
      delete this.headers['meedbankingclub-username'];
    }
    if (this.headers['meedbankingclub-customerid']) {
      this.headers['X-axxiome-digital-customerId'] = this.headers['meedbankingclub-customerid'];
      delete this.headers['meedbankingclub-customerid'];
    }

    // we want to know in which request error occured so we use requestId
    // Bank UUID instead of our correlation id

    // if (this.headers['MeedBankingClub-Correlation-Id']) {
    //   this.headers['X-axxiome-digital-uuid'] = this.headers['MeedBankingClub-Correlation-Id'];
    //   delete this.headers['MeedBankingClub-Correlation-Id'];
    // }

    if (this.headers['meedbankingclub-otp-id']) {
      this.headers['X-axxiome-digital-otp-id'] = this.headers['meedbankingclub-otp-id'];
      delete this.headers['meedbankingclub-otp-id'];
    }
    if (this.headers['meedbankingclub-otp-token']) {
      this.headers['X-axxiome-digital-otp-token'] = this.headers['meedbankingclub-otp-token'];
      delete this.headers['meedbankingclub-otp-token'];
    }

    // adding requestId to bank UUID so we can identify in which request error occured if any error occur
    const { requestId } = httpContext.get('loggingContext');
    this.headers['X-axxiome-digital-uuid'] = requestId;

    // means we have not authenticated yet and are calling apis before security is required
    // so the access token for the bank will not be present in the MeedJWT token
    // so in that case we should just call the getAccessToken
    if (!this.token) {
      const accessToken = await this.getAccessToken();
      this.headers.Authorization = `Bearer ${accessToken}`;
    }

    for (const key in this.token) {
      if (key === 'bankToken') {
        this.headers['X-axxiome-digital-token'] = this.token.bankToken;
      } else if (key === 'accessToken') {
        this.headers.Authorization = `Bearer ${this.token.accessToken}`;
      } else {
        logger.warn('no other security header found');
      }
    }

    // TODO: Just to filter the headers that we need in every bank request, will be removed may be
    const IBankHeaders = [
      'X-axxiome-digital-user',
      'X-axxiome-digital-uuid',
      'X-axxiome-digital-token',
      'Authorization',
      'X-axxiome-digital-otp-id',
      'X-axxiome-digital-otp-token',
      'X-axxiome-digital-customerId'
    ];

    const retVal = _.pick(this.headers, IBankHeaders);
    return {
      headers: retVal
    };
  }
}
