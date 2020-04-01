const https = require('https');
import axiosLib, { AxiosInstance } from 'axios';
import httpContext from 'express-http-context';
import config from '../config/config';
import MeedUtils from './utils';
/**
 *  Wrapper to create and use singleton instead of create per request.
 *
 * @export
 * @class MeedAxios
 */
export class MeedAxios {
  private static axios: AxiosInstance;
  private static urbarAirshipAxios: any;
  private static affinityAxios: any;
  private static virtualAssistantAxios: any;
  private static jumioAxios: any;
  public static apiLogs: any = [];
  private static vaLiveChatAxios: any;
  private static vaSaveChatAxios: any;
  private static briteVerifyAxios: AxiosInstance;

  private constructor() {}

  private static logResponse(response): any {
    const context = httpContext.get('loggingContext');
    const resLog = {
      request: {
        url: response.config.baseURL + response.config.url,
        body: MeedUtils.isJSON(response.config.data) || response.config.data,
        method: response.config.method
      },
      response: {
        status: response.status,
        body: response.data
      }
    };

    MeedAxios.apiLogs.push(resLog);

    const API_CALL = MeedAxios.apiLogs;

    httpContext.set('loggingContext', { ...context, API_CALL });

    return response;
  }

  private static logError(err): any {
    const context = httpContext.get('loggingContext');
    const errorLog = {
      request: {
        method: err.config.method,
        url: err.config.baseURL + err.config.url,
        requestBody: MeedUtils.isJSON(err.config.data) || err.config.data
      },
      error: {
        status: err.response && err.response.status,
        statusText: err.response && err.response.statusText,
        responseBody: MeedUtils.isJSON(err.response.data) || err.response.data
      }
    };

    MeedAxios.apiLogs.push(errorLog);

    const API_CALL = MeedAxios.apiLogs;

    httpContext.set('loggingContext', { ...context, API_CALL });
    return Promise.reject(err);
  }
  /**
   *  Returns an instance of axios which can then be reused by different services
   *
   * @static
   * @returns {*}
   * @memberof MeedAxios
   */
  public static getAxiosInstance(): any {
    if (!MeedAxios.axios) {
      MeedAxios.axios = axiosLib.create({
        baseURL: config.api.axxiome.url,
        headers: {
          Accept: '*/*',
          'Accept-Language': 'en-US'
        },
        // TODO: Should be remove. Currently this bypass the SSL Verification
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // Logging API request and Response or Error if occered
      MeedAxios.axios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    return MeedAxios.axios;
  }

  public static getBriteVerifyInstance(): AxiosInstance {
    if (!MeedAxios.briteVerifyAxios) {
      MeedAxios.briteVerifyAxios = axiosLib.create({
        baseURL: `${config.briteVerify.url}`,
        headers: {
          Accept: '*/*',
          'Accept-Language': 'en-US'
        },
        // TODO: Should be remove. Currently this bypass the SSL Verification
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // Logging API request and Response or Error if occered
      MeedAxios.briteVerifyAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    return MeedAxios.briteVerifyAxios;
  }

  /**
   * Returns an instance of axios which is used by Urban Airship
   *
   * @static
   * @returns {*}
   * @memberof MeedAxios
   */
  public static getAxiosInstanceForUAS(): any {
    if (!MeedAxios.urbarAirshipAxios) {
      MeedAxios.urbarAirshipAxios = axiosLib.create({
        baseURL: config.urbanAirship.baseUrl,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.urbanairship+json; version=3;'
        }
      });
      // Logging API request and Response or Error if occered
      MeedAxios.urbarAirshipAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    (MeedAxios.getAxiosInstanceForUAS as any).masterAuth = () => ({
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.urbanAirship.key}:${config.urbanAirship.masterSecret}`).toString(
          'base64'
        )}`
      }
    });

    return MeedAxios.urbarAirshipAxios;
  }

  public static getAffinityAxiosInstance(): any {
    if (!MeedAxios.affinityAxios) {
      MeedAxios.affinityAxios = axiosLib.create({
        baseURL: config.api.affinity.url,
        // TODO axios can't not handle params
        // Read More: https://github.com/axios/axios/issues/2230
        params: {
          sid: config.api.affinity.sid,
          passphrase: config.api.affinity.passphrase
        },
        headers: {
          Accept: '*/*',
          'Accept-Language': 'en-US'
        },
        // TODO: Should be remove. Currently this bypass the SSL Verification
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // TODO: Add Axios Request Response Interceptor for Logging
      // MeedAxios.affinityAxios.interceptors.request.use();
      // Response Interceptor
      /*MeedAxios.affinityAxios.interceptors.response.use(
        function(response) {
          if (config.logging.enableExternalHttpLog) {
            let logInfo = {
              status: response.status,
              duration: new Date() - response.config.metadata.startTime,
              method: response.config.method,
              url: response.config.url,
              reqBody: response.config.data,
              data: response.data
            };
            req.logInfo.push(logInfo);
          }
          return response;
        },
        function(error) {
          if (config.logging.enableExternalHttpLog) {
            error.config = error.config || {};
            error.response = error.response || {};
            let startTime =
              error.config.metadata && error.config.metadata.startTime ? error.config.metadata.startTime : new Date();
            let logInfo = {
              status: error.response ? error.response.status : 408,
              duration: new Date() - startTime,
              method: error.config.method,
              url: error.config.url,
              reqBody: error.config.data,
              data: error.response ? error.response.data : ''
            };
            req.logInfo.push(logInfo);
          }
          return Promise.reject(error);
        }
      );*/

      // Logging API request and Response or Error if occered
      MeedAxios.affinityAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    return MeedAxios.affinityAxios;
  }

  /**
   * Get an instance for Virtual Assistant
   * @static
   * @returns {*}
   * @memberof MeedAxios
   */
  public static getAxiosInstanceForVA(): any {
    if (!MeedAxios.virtualAssistantAxios) {
      MeedAxios.virtualAssistantAxios = axiosLib.create({
        baseURL: config.virtualAssistance.baseUrl,
        headers: {
          Accept: '*/*'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // Logging API request and Response or Error if occered
      MeedAxios.virtualAssistantAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    return MeedAxios.virtualAssistantAxios;
  }

  public static getAxiosInstanceForJumio(isScanURL: boolean = false, baseURL: string = config.jumio.baseUrl): any {
    if (!MeedAxios.jumioAxios) {
      MeedAxios.jumioAxios = axiosLib.create({
        baseURL: !isScanURL ? baseURL : config.jumio.scanURL,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${config.jumio.apiToken}:${config.jumio.apiSecret}`).toString('base64')}`
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // Logging API request and Response or Error if occered
      MeedAxios.jumioAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }
    return MeedAxios.jumioAxios;
  }

  /**
   * @static
   * @returns {*}
   * @memberof MeedAxios
   */
  public static getAxiosInstanceLiveChat(): any {
    if (!MeedAxios.vaLiveChatAxios) {
      MeedAxios.vaLiveChatAxios = axiosLib.create({
        baseURL: config.virtualAssistance.liveChatBaseUrl,
        headers: {
          Accept: '*/*'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // Logging API request and Response or Error if occered
      MeedAxios.vaLiveChatAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    return MeedAxios.vaLiveChatAxios;
  }

  /**
   * @static
   * @returns {*}
   * @memberof MeedAxios
   */
  public static getAxiosInstanceSaveChat(): any {
    if (!MeedAxios.vaSaveChatAxios) {
      MeedAxios.vaSaveChatAxios = axiosLib.create({
        baseURL: config.virtualAssistance.saveLivechatHistoryNavApi,
        headers: {
          Accept: '*/*'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });

      // Logging API request and Response or Error if occered
      MeedAxios.vaSaveChatAxios.interceptors.response.use(MeedAxios.logResponse, MeedAxios.logError);
    }

    return MeedAxios.vaSaveChatAxios;
  }
}
