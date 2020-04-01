import { AffinityErrorMapper } from './errors';

import { IAffinityAuthCredential, IAffinitySession } from '../models/affinity-service/interface';
import { MeedAxios } from '../../utils/api';
import { HTTPError } from '../../utils/httpErrors';
import { RequestMapper, ResponseMapper } from './mappers';
import config from '../../config/config';
import IAuthToken from '../../interfaces/authToken';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import { ICustomerService } from '../models/customer-service/interface';

export default class AffinityAuth {
  /**
   * @static
   * @param {string} uniqueId
   * @returns {Promise<IAffinitySession>}
   * @memberof AffinityAuth
   */
  static async getSession(uniqueId: string): Promise<IAffinitySession> {
    try {
      // Here i am send sid & passphrase directly from config file
      // because axios can't not handle params from axios.create()
      // Axios >0.18 version has this issue
      // Read More: https://github.com/axios/axios/issues/2230
      // TODO remove all config data after fixed axios issue
      const params = {
        sid: config.api.affinity.sid,
        passphrase: config.api.affinity.passphrase,
        method: 'authenticate',
        usage: 'mobile',
        uniqueid: uniqueId
      };
      // GET Session ID or formally SID
      const session = await MeedAxios.getAffinityAxiosInstance().get('', { params });

      if (session.data.status === 'fail') {
        const { httpCode, message, errorCode } = AffinityErrorMapper.getFailedError(session.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      return await ResponseMapper.mapAffinitySession(session.data);
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = AffinityErrorMapper.getSessionError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Create a new Affinity Member Account if not exist
   *
   * @return Boolean
   * @param requestBody
   */
  private static async registerAffinityUser(requestBody: IAffinityAuthCredential): Promise<IAffinitySession> {
    try {
      const registerAffinityUserBody = RequestMapper.mapRegisterAffinityUser(requestBody);

      // // TODO remove all config data after fixed axios issue
      const commonParams = {
        sid: config.api.affinity.sid,
        passphrase: config.api.affinity.passphrase,
        method: 'registration_save',
        unique_id: requestBody.uniqueId
      };
      const params = { ...commonParams, ...registerAffinityUserBody };
      const response = await MeedAxios.getAffinityAxiosInstance().get('', { params });
      if (response.data && response.data.status === 'fail') {
        const { httpCode, message, errorCode } = AffinityErrorMapper.getFailedError(response.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      return await ResponseMapper.mapAffinitySessionAfterReg(response);
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = AffinityErrorMapper.getSessionError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * If registered returns session data, otherwise register and return session id
   *
   * @static
   * @param {*} headers
   * @param {IAuthToken} token
   * @returns {Promise<IAffinitySession>}
   * @memberof AffinityAuth
   */
  static async getSessionOrRegister(headers: any, token: IAuthToken): Promise<IAffinitySession> {
    const customerId = headers['meedbankingclub-customerid'];
    const username = headers['meedbankingclub-username'];
    try {
      const session = await this.getSession(customerId);
      return session;
    } catch (error) {
      // if not HTTPError then there's something wrong, otherwise ignore, go next and register as new affinity user
      if (!(error instanceof HTTPError)) {
        const { message, errorCode, httpCode } = AffinityErrorMapper.getSessionError(error);
        throw new HTTPError(message, errorCode, httpCode);
      }
    }

    const customerService = DIContainer.getNamed<ICustomerService>(
      TYPES.CustomerService,
      headers['meedbankingclub-bank-identifier']
    );
    customerService.getAuthorizationService().setHeadersAndToken(headers, token);

    const customerInfo = ((await customerService.customerInfo(
      headers['meedbankingclub-memberid']
    )) as unknown) as IAffinityAuthCredential;
    customerInfo.uniqueId = customerId;
    customerInfo.username = username;

    await this.registerAffinityUser(customerInfo);
    const newSession = await this.getSession(customerId);
    return newSession;
  }
}
