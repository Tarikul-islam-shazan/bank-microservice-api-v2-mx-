import config from '../../config/config';
import { MeedAxios } from '../../utils/api';
import {
  IUrbanAirshipService,
  IUASRegEmail,
  IUASAssociateEmailToNamedUserId,
  IUASAddInitialTags,
  IUASAddRemoveTag,
  IAuthHeader,
  IUASUpdateEmail,
  IUASCommonResponse,
  IUASNamedUserLookupResponse,
  IUASPushMessage,
  IUASCustomEvent
} from '../models/urban-airship/interface';
import { HTTPError } from '../../utils/httpErrors';
import { UrbanAirshipResponseMappers } from './mappers/response';
import { UasErrorMapper } from './errors/uasErrors';
import { UASRequestMapper } from './mappers';
import { injectable } from 'inversify';

const API_CHANNEL_URL = '/api/channels';
const NAMED_USERS_URL = '/api/named_users';
const PUSH_URL = '/api/push';
const TEMPLATE_PUSH_URL = '/api/templates/push';
const CUSTOM_EVENT_URL = '/api/custom-events';
const EMAIL_CHANNEL_URL = '/api/channels/email';

const token = config.urbanAirship.token;
const key = config.urbanAirship.key;
const masterSecret = config.urbanAirship.masterSecret;

@injectable()
class UrbanAirshipService implements IUrbanAirshipService {
  constructor() {}

  /**
   * Add Authorization Token header to axios requests
   *
   * @private
   * @returns {IAuthHeader}
   * @memberof UrbanAirshipService
   */
  private addToken(): IAuthHeader {
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  /**
   * Add Authorization Key header to axios requests
   *
   * @private
   * @returns {IAuthHeader}
   * @memberof UrbanAirshipService
   */
  private addAuth(): IAuthHeader {
    return { headers: { Authorization: `Basic ${this.getBase64(key + ':' + masterSecret)}` } };
  }

  private addCustomEventHeader() {
    return { headers: { Authorization: 'Bearer ' + token, 'X-UA-Appkey': key } };
  }

  private getBase64(text: string): string {
    return Buffer.from(text).toString('base64');
  }

  /**
   * Sends a POST request to `${API_CHANNEL_URL}/email` to register email address.
   * Gets the Authorization header from addToken() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {IUASRegEmail} channel: { type, commercial_opted_in, address, timezone, locale_country, locale_language }
   * @returns {Promise<IUASCommonResponse>} { data: { ok: boolean, channel_id: string } }
   * @memberof UrbanAirshipService
   */
  async uasRegisterEmailAddress(channel: IUASRegEmail): Promise<IUASCommonResponse> {
    try {
      const response = await MeedAxios.getAxiosInstanceForUAS().post(
        `${API_CHANNEL_URL}/email`,
        channel,
        this.addToken()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Sends a POST request to `${API_CHANNEL_URL}/email/${channelID}` to update email channel.
   * Gets the Authorization key from addAuth() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {string} channelID
   * @param {IUASUpdateEmail} channel: { type, commercial_opted_in, address }
   * @returns {Promise<IUASCommonResponse>} { data: { ok: boolean, channel_id: string } }
   * @memberof UrbanAirshipService
   */
  async uasUpdateEmailChannel(channelData: IUASUpdateEmail): Promise<IUASCommonResponse> {
    try {
      const { channelID, type, commercial_opted_in, address } = channelData;
      const channel = { type, commercial_opted_in, address };
      const response = await MeedAxios.getAxiosInstanceForUAS().put(
        `${API_CHANNEL_URL}/email/${channelID}`,
        { channel },
        this.addToken()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Sends a POSTrequest to `${NAMED_USERS_URL}/associate` to associate email to user.
   * Gets the Authorization key from addAuth() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {IUASAssociateEmailToNamedUserId} {
   *     channel_id,
   *     device_type = ''
   *     named_user_id
   *   }
   * @returns {Promise<IUASCommonResponse>} { data: ok: boolean }
   * @memberof UrbanAirshipService
   */
  async uasAssociateEmailToNamedUserId(associatePayload: IUASAssociateEmailToNamedUserId): Promise<IUASCommonResponse> {
    try {
      const response = await MeedAxios.getAxiosInstanceForUAS().post(
        `${NAMED_USERS_URL}/associate`,
        associatePayload,
        this.addAuth()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Sends a GET request to `${NAMED_USERS_URL}/?id=${namedUser}` to get named user.
   * Gets the Authorization key from addAuth() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {string} namedUser
   * @returns {Promise<IUASNamedUserLookupResponse>} { data: ['meed_push', 'meed_email'] }
   * @memberof UrbanAirshipService
   */
  async uasNamedUserLookup(namedUser: string): Promise<IUASNamedUserLookupResponse> {
    try {
      const response = await MeedAxios.getAxiosInstanceForUAS().get(
        `${NAMED_USERS_URL}/?id=${namedUser}`,
        this.addAuth()
      );
      return UrbanAirshipResponseMappers.uasNamedUserLookup(response.data);
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasLookupError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Sends a POST request to `${NAMED_USERS_URL}/tags` to add initial tags
   * Gets the Authorization key from addToken() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {IUASAddInitialTags} { namedUser, banks }
   * @returns {Promise<IUASCommonResponse>} { data: { ok: boolean } }
   * @memberof UrbanAirshipService
   */
  async uasAddInitialTags({ namedUser, banks }: IUASAddInitialTags): Promise<IUASCommonResponse> {
    try {
      const request = {
        audience: {
          named_user_id: [namedUser]
        },
        add: {
          bank: banks,
          meed_opt_in: ['meed_email', 'meed_push']
        }
      };
      const response = await MeedAxios.getAxiosInstanceForUAS().post(
        `${NAMED_USERS_URL}/tags`,
        { ...request },
        this.addToken()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Sends a POST request to `${NAMED_USERS_URL}/tags` to add tag.
   * Gets the Authorization key from addToken() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {IUASAddRemoveTag} { namedUser, tag }
   * @returns {Promise<IUASCommonResponse>}  { data: { ok } }
   * @memberof UrbanAirshipService
   */
  async uasAddTag({ namedUser, tag, tagName = 'meed_opt_in' }: IUASAddRemoveTag): Promise<IUASCommonResponse> {
    try {
      const request = {
        audience: {
          named_user_id: namedUser
        },
        add: {
          [tagName]: [tag]
        }
      };
      const response = await MeedAxios.getAxiosInstanceForUAS().post(
        `${NAMED_USERS_URL}/tags`,
        { ...request },
        this.addToken()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Sends a POST request to `${NAMED_USERS_URL}/tags` to remove tag.
   * Gets the Authorization key from addToken() method.
   *
   * Returns response if request is successfull or
   * throws HTTPERROR if any error occurs.
   *
   * @param {IUASAddRemoveTag} { namedUser, tag }
   * @returns {Promise<IUASCommonResponse>} { data: { ok } }
   * @memberof UrbanAirshipServiceAirshipErrorMapper.commonCatchError(error)
   */
  async uasRemoveTag({ namedUser, tag }: IUASAddRemoveTag): Promise<IUASCommonResponse> {
    try {
      const request = {
        audience: {
          named_user_id: namedUser
        },
        remove: {
          meed_opt_in: [tag]
        }
      };
      const response = await MeedAxios.getAxiosInstanceForUAS().post(
        `${NAMED_USERS_URL}/tags`,
        { ...request },
        this.addToken()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Push message in app without template
   * @param {IUASPushMessage} pushMessage
   * @returns {Promise<any>}
   * @memberof UrbanAirshipService
   */
  async pushInAppMessage(pushMessage: IUASPushMessage): Promise<any> {
    try {
      const requestBody = UASRequestMapper.pushInAppMessage(pushMessage);
      const response = await MeedAxios.getAxiosInstanceForUAS().post(PUSH_URL, requestBody, this.addAuth());
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Push message with template id
   * @param {IUASPushMessage} pushMessage
   * @returns {Promise<any>}
   * @memberof UrbanAirshipService
   */
  async pushTemplateMessage(pushMessage: IUASPushMessage): Promise<any> {
    try {
      const requestBody = UASRequestMapper.pushTemplateMessage(pushMessage);
      const response = await MeedAxios.getAxiosInstanceForUAS().post(TEMPLATE_PUSH_URL, requestBody, this.addAuth());
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Push custom event to user
   * @param {IUASCustomEvent} eventData
   * @returns {Promise<any>}
   * @memberof UrbanAirshipService
   */
  async pushCustomEvent(eventData: IUASCustomEvent): Promise<any> {
    try {
      const requestBody = UASRequestMapper.customEvent(eventData);
      const response = await MeedAxios.getAxiosInstanceForUAS().post(
        CUSTOM_EVENT_URL,
        requestBody,
        this.addCustomEventHeader()
      );
      return response.data;
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Lookup for an email
   * @param {string} email
   * @returns {Promise<any>}
   * @memberof UrbanAirshipService
   */
  async emailLookup(email: string): Promise<Partial<IUASNamedUserLookupResponse>> {
    try {
      const response = await MeedAxios.getAxiosInstanceForUAS().get(`${EMAIL_CHANNEL_URL}/${email}`, this.addToken());
      return UrbanAirshipResponseMappers.emailLookup(response.data);
    } catch (error) {
      const { message, errorCode, httpCode } = UasErrorMapper.uasError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export { UrbanAirshipService };
