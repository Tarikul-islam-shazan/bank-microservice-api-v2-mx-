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
    // TODO: need to update for mexico bank
    return 'this-is-demo-access-token-for-mexico-invex-bank';
  }

  public async getBankHeaders(): Promise<object> {
    if (!this.headers) {
      const { message, errorCode, httpCode } = BankAuthCodes.HEADERS_NOT_SET;
      throw new HTTPError(message, errorCode, httpCode);
    }

    // TODO: need to update for mexico bank
    return {
      headers: {}
    };
  }
}
