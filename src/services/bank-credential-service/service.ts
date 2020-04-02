import { injectable, inject, named } from 'inversify';
import { IAuthorization } from '../bank-auth/models/interface';
import { MeedAxios } from '../../utils/api';
import { HTTPError } from '../../utils/httpErrors';
import {
  IUserCredentials,
  IBankAPICredentials,
  IBankCredentialService,
  IChallengeQuestions,
  IChallengeAnswers,
  IOtp
} from '../models/bank-credentials-service/interface';
import RequestMapper from './mappers/request-mapper';
import { CredErrorMapper, AxErrorCodes } from './errors';
import { TYPES } from '../../utils/ioc/types';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import logger from '../../utils/logger';
import { AxErrorMapper } from '../../utils/error-mapper/axError';
import ResponseMapper from './mappers/response-mapper';
import config from '../../config/config';

@injectable()
class BankCredentialService implements IBankCredentialService {
  private auth: IAuthorization;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  public async login(credential: IUserCredentials): Promise<IBankAPICredentials> {
    try {
      // getting required HTTP headers from bank auth service
      const headers = await this.auth.getBankHeaders();

      // transforming credentials data for bank
      const loginData = RequestMapper.credentialDTO(credential);
      // calling bank api for bank token
      const loginRes = await MeedAxios.getAxiosInstance().post(
        `/login/${config.api.axxiome.version}/login`,
        loginData,
        headers
      );

      const bankToken = loginRes.headers['x-axxiome-digital-token'];
      const accessToken = await this.auth.getAccessToken();

      // returning bank token
      const validatedCreds: IBankAPICredentials = {
        bankToken,
        accessToken
      };

      return validatedCreds;
    } catch (err) {
      const { message, httpCode, errorCode } = CredErrorMapper.loginError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @param {string} email
   * @returns {Promise<any>}
   * @memberof BankCredentialService
   */
  public async forgotUsername(email: string): Promise<string> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/userManagement/${config.api.axxiome.version}/users/recoverUsername`,
        { EMail: email },
        headers
      );
      return typeof response.data === 'string' && response.data
        ? response.data
        : response.data.Message
        ? response.data.Message
        : 'Username recovery done';
    } catch (error) {
      const { message, httpCode, errorCode } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   *
   * @param {string} username
   * @returns {Promise<any>}
   * @memberof BankCredentialService
   */
  public async getChallengeQuestions(username: string): Promise<IChallengeQuestions | IOtp> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/userManagement/${config.api.axxiome.version}/users/${username}/passwordRecovery`,
        headers
      );
      return ResponseMapper.getChallengeQuestions(response.data);
    } catch (error) {
      const errorResponse = CredErrorMapper.getChallengeQuestions(error);
      if (errorResponse.httpCode === 403) {
        return errorResponse as any;
      }
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  /**
   * @param {string} username
   * @param {IChallengeQuestion} questionAndanswer
   * @returns {Promise<any>}
   * @memberof BankCredentialService
   */
  public async validateChallengeQuestions(username: string, answers: IChallengeAnswers): Promise<any> {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.validateChallengeQuestion(answers);
      const response = await MeedAxios.getAxiosInstance().post(
        `/userManagement/${config.api.axxiome.version}/users/${username}/passwordRecovery/${answers.key}/validate`,
        apiBody,
        headers
      );
      return ResponseMapper.getChallengeQuestions(response.data);
    } catch (error) {
      const { message, httpCode, errorCode } = CredErrorMapper.validateChallengeQuestions(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @param {string} username
   * @param {string} recoveryKey
   * @param {string} password
   * @returns {Promise<string>}
   * @memberof BankCredentialService
   */
  public async resetPassword(username: string, recoveryKey: string, password: string): Promise<string> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/userManagement/${config.api.axxiome.version}/users/${username}/passwordRecovery/${recoveryKey}/setPassword`,
        { Password: password },
        headers
      );
      return typeof response.data === 'string' && response.data
        ? response.data
        : response.data.Message
        ? response.data.Message
        : 'Password reset successfully';
    } catch (error) {
      const { message, httpCode, errorCode } = CredErrorMapper.resetPassword(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @param {string} username
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<any>}
   * @memberof BankCredentialService
   */
  async changePassword(username: string, currentPassword: string, newPassword: string): Promise<string> {
    // Bank is not returning any specific error for this
    if (currentPassword === newPassword) {
      const { message, httpCode, errorCode } = AxErrorCodes.PASSWORD_IS_SAME;
      throw new HTTPError(message, errorCode, httpCode);
    }

    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.changePassword({ currentPassword, newPassword });
      const response = await MeedAxios.getAxiosInstance().patch(
        `/userManagement/${config.api.axxiome.version}/users/${username}/changePassword`,
        { ...apiBody },
        headers
      );
      return typeof response.data?.Message === 'string' ? response.data.Message : 'Password is updated successfully';
    } catch (error) {
      const { message, httpCode, errorCode } = CredErrorMapper.changePassword(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default BankCredentialService;
