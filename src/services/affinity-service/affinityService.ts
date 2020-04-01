import { Category, Offer, OfferDetails } from '../models/affinity-service';
import AffinityAuth from './affinityAuth';
import { MeedAxios } from '../../utils/api';
import { AffinityErrorMapper } from './errors';
import { HTTPError } from '../../utils/httpErrors';
import { AxErrorMapper } from '../../utils/error-mapper/axError';
import { ResponseMapper } from './mappers';
import config from '../../config/config';
import IAuthToken from '../../interfaces/authToken';

export default class AffinityService extends AffinityAuth {
  /**
   * @static
   * @param {*} headers
   * @param {IAuthToken} token
   * @returns {Promise<Category[]>}
   * @memberof AffinityService
   */
  static async getCategoryList(headers: any, token: IAuthToken): Promise<Category[]> {
    try {
      const { sessionId } = await this.getSessionOrRegister(headers, token);

      // Here i am send sid & passphrase directly from config file
      // because axios can't not handle params from axios.create()
      // Axios >0.18 version has this issue
      // Read More: https://github.com/axios/axios/issues/2230
      const params = {
        sid: sessionId,
        passphrase: config.api.affinity.passphrase,
        method: 'category_list',
        usage: 'mobile'
      };
      const response = await MeedAxios.getAffinityAxiosInstance().get('', { params });

      if (response.data && response.data.status === 'fail') {
        const { message, errorCode, httpCode } = AffinityErrorMapper.getFailedError(response.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      return await ResponseMapper.mapAffinityCategories(response.data);
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { errorCode, httpCode } = AxErrorMapper.getError(error);
      throw new HTTPError(error.message, errorCode, httpCode);
    }
  }

  static async getOffers(uniqueId: string, searchParams: object = {}): Promise<Offer[]> {
    try {
      const { sessionId } = await this.getSession(uniqueId);
      const commonParams = {
        sid: sessionId,
        passphrase: config.api.affinity.passphrase,
        method: 'offer_search'
      };
      const params = { ...commonParams, ...searchParams };
      const response = await MeedAxios.getAffinityAxiosInstance().get('', { params });

      if (response.data && response.data.status === 'fail') {
        const { message, errorCode, httpCode } = AffinityErrorMapper.getFailedError(response.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      return await ResponseMapper.mapAffinityOffers(this.objectToArray(response.data, 'results'));
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { errorCode, httpCode } = AxErrorMapper.getError(error);
      throw new HTTPError(error.message, errorCode, httpCode);
    }
  }

  static async getFeaturedOffers(uniqueId: string): Promise<Offer[]> {
    try {
      const { sessionId } = await this.getSession(uniqueId);
      const params = {
        sid: sessionId,
        passphrase: config.api.affinity.passphrase,
        method: 'offer_feature'
      };
      const response = await MeedAxios.getAffinityAxiosInstance().get('', { params });

      if (response.data && response.data.status === 'fail') {
        const { message, errorCode, httpCode } = AffinityErrorMapper.getFailedError(response.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      return ResponseMapper.mapAffinityFeatureOffer(this.objectToArray(response.data, 'results'));
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { errorCode, httpCode } = AxErrorMapper.getError(error);
      throw new HTTPError(error.message, errorCode, httpCode);
    }
  }

  static async activateOffer(uniqueId: string, offerId: string): Promise<Offer> {
    try {
      const { sessionId } = await this.getSession(uniqueId);
      const params = {
        sid: sessionId,
        passphrase: config.api.affinity.passphrase,
        method: 'offer_activate',
        xid: offerId
      };
      const response = await MeedAxios.getAffinityAxiosInstance().get('', { params });
      if (response.data && response.data.status === 'fail') {
        const { message, errorCode, httpCode } = AffinityErrorMapper.getFailedError(response.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      return response.data;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { errorCode, httpCode } = AxErrorMapper.getError(error);
      throw new HTTPError(error.message, errorCode, httpCode);
    }
  }

  static async getOfferDetails(uniqueId: string, offerId: string, searchParams: object = {}): Promise<OfferDetails> {
    try {
      const { sessionId } = await this.getSession(uniqueId);
      const commonParams = {
        sid: sessionId,
        passphrase: config.api.affinity.passphrase,
        method: 'offer_detail',
        xid: offerId
      };
      const params = { ...commonParams, ...searchParams };
      const response = await MeedAxios.getAffinityAxiosInstance().get('', { params });

      if (response.data && response.data.status === 'fail') {
        const { message, errorCode, httpCode } = AffinityErrorMapper.getFailedError(response.data);
        throw new HTTPError(message, errorCode, httpCode);
      }

      const results = this.objectToArray(response.data, 'results').map(result => {
        result.value.xstores = this.objectToArray(result.value, 'xstores');
        return result;
      });

      return ResponseMapper.mapAffinityOfferDetails(results);
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { errorCode, httpCode } = AxErrorMapper.getError(error);
      throw new HTTPError(error.message, errorCode, httpCode);
    }
  }

  private static objectToArray(object, property) {
    const result = [];
    const _object = property ? object[property] : object;
    for (const key in _object) {
      if (_object.hasOwnProperty(key)) {
        result.push({
          id: key,
          value: _object[key]
        });
      }
    }
    return result;
  }
}
