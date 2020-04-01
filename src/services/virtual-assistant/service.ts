import { HTTPError } from '../../utils/httpErrors';
import {
  Businessarea,
  IVAData,
  IVAAutoSuggestion,
  IVirtualAssistant,
  IVADTree,
  IChatHistory,
  IChatSession
} from '../models/virtual-assistant/interface';
import { MeedAxios } from '../../utils/api';
import { ErrorMapper } from '../../utils/error-mapper/errorMapper';
import { VirtualAssistantErrCodes } from './errors';
import { VAResponseMapper, VARequestMapper } from './mappers';
import config from '../../config/config';

export class VirtualAssistantService {
  constructor() {}

  /**
   * @static
   * @param {string} language
   * @returns {Promise<IVirtualAssistant>}
   * @memberof VirtualAssistantService
   */
  static async initialize(language: string): Promise<IVirtualAssistant> {
    try {
      const businessarea = this.getBusinessarea(language);
      const response = await MeedAxios.getAxiosInstanceForVA().get('', {
        params: {
          init: 1,
          type: 'json',
          businessarea
        }
      });

      if (response.data.info.status !== 'success') {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_INIT;
        throw new HTTPError(response.data.info.message || message, errorCode, httpCode);
      }

      return VAResponseMapper.vaDTO(response.data) as IVirtualAssistant;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {IVAData} virtualAssistant
   * @returns {Promise<IVirtualAssistant>}
   * @memberof VirtualAssistantService
   */
  static async chat(virtualAssistant: IVAData): Promise<IVirtualAssistant> {
    try {
      const response = await MeedAxios.getAxiosInstanceForVA().get('', {
        params: this.getChatParams(virtualAssistant)
      });

      if (response.data.info.status !== 'success') {
        const { message, errorCode, httpCode } = virtualAssistant.recognition_id
          ? VirtualAssistantErrCodes.UNABLE_TO_GET_RESPONSE_FAQ
          : VirtualAssistantErrCodes.UNABLE_TO_GET_ANSWER;
        throw new HTTPError(response.data.info.message || message, errorCode, httpCode);
      }

      return VAResponseMapper.vaDTO(response.data) as IVirtualAssistant;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {IVAData} virtualAssistant
   * @returns {Promise<IVAAutoSuggestion[]>}
   * @memberof VirtualAssistantService
   */
  static async getAutosuggestion(virtualAssistant: IVAData): Promise<IVAAutoSuggestion[]> {
    try {
      const response = await MeedAxios.getAxiosInstanceForVA().get('', {
        params: {
          type: 'json',
          AUTO_COMPLETE: 1,
          FAQ: 1,
          ident: virtualAssistant.ident,
          userlogid: virtualAssistant.userlogid,
          channel: virtualAssistant.channel,
          businessArea: virtualAssistant.business_area,
          entry: virtualAssistant.entry
        }
      });

      if (!response.data) {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_GET_AUTO_SUGGESTION;
        throw new HTTPError(response.data.info.message || message, errorCode, httpCode);
      }

      // empty reponse, no autosuggestion found
      if (!response.data.AutoCompleteInfo || !response.data.AutoCompleteInfo.AutoComplete) {
        return [] as IVAAutoSuggestion[];
      }

      return response.data.AutoCompleteInfo.AutoComplete as IVAAutoSuggestion[];
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {IVAData} virtualAssistant
   * @returns {Promise<IVirtualAssistant>}
   * @memberof VirtualAssistantService
   */
  static async submitAutosuggestion(virtualAssistant: IVAData): Promise<IVirtualAssistant> {
    try {
      const response = await MeedAxios.getAxiosInstanceForVA().get('', {
        params: {
          type: 'SELECT',
          selectSource: 'autocomplete',
          AnswerLinkId: virtualAssistant.answer_id,
          RecognitionId: virtualAssistant.recognition_id,
          ident: virtualAssistant.ident,
          userlogid: virtualAssistant.userlogid,
          channel: virtualAssistant.channel,
          businessArea: virtualAssistant.business_area,
          entry: virtualAssistant.entry
        }
      });

      if (!response.data) {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_SUBMIT_AUTO_SUGGESTION;
        throw new HTTPError(response.data.info.message || message, errorCode, httpCode);
      }

      return VAResponseMapper.vaDTO(response.data) as IVirtualAssistant;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {IVADTree} vaDTree
   * @returns {Promise<any>}
   * @memberof VirtualAssistantService
   */
  static async submitDialogueTree(vaDTree: IVADTree): Promise<IVirtualAssistant> {
    try {
      const response = await MeedAxios.getAxiosInstanceForVA().get('', {
        params: {
          type: 'json',
          ident: vaDTree.ident,
          userlogid: vaDTree.userlogid,
          channel: vaDTree.channel,
          businessArea: vaDTree.business_area,
          entry: vaDTree.entry,
          DTreeRequestType: vaDTree.DTreeRequestType,
          Connector_ID: vaDTree.Connector_ID,
          DTREE_OBJECT_ID: vaDTree.DTREE_OBJECT_ID,
          DTREE_NODE_ID: vaDTree.DTREE_NODE_ID,
          ICS_SOURCE_ANSWER_ID: vaDTree.ICS_SOURCE_ANSWER_ID
        }
      });

      if (!response.data) {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_SUBMIT_DTREE;
        throw new HTTPError(response.data.info.message || message, errorCode, httpCode);
      }

      return VAResponseMapper.vaDTO(response.data) as IVirtualAssistant;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {*} va
   * @returns {Promise<any>}
   * @memberof VirtualAssistantService
   */
  static async createLiveChatSession(chatSession: IChatSession): Promise<any> {
    try {
      const liveChatCustomerID = config.virtualAssistance.liveChatCustomerID;
      const departmentID = config.virtualAssistance.departmentID;

      const responseQueues = await MeedAxios.getAxiosInstanceLiveChat().get(
        `StateManager/queues/customer/${liveChatCustomerID}/department/${departmentID}/availableQueues`
      );

      if (!responseQueues.data.queueStateVOList || !responseQueues.data.queueStateVOList.length) {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE;
        throw new HTTPError(message, errorCode, httpCode);
      }

      const chatQueueList = this.getQueueInfo(chatSession.language, responseQueues.data.queueStateVOList);
      const responseRefreshToken = await MeedAxios.getAxiosInstanceLiveChat().get(`livechat/refreshToken.html`);

      if (!responseRefreshToken.data) {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_REFRESH_TOKEN;
        throw new HTTPError(message, errorCode, httpCode);
      }

      const cookies = responseRefreshToken.headers['set-cookie'][0];
      const headers = {
        'X-CSRF-TOKEN': responseRefreshToken.data,
        'Content-Type': 'application/json',
        cookie: cookies
      };

      const endUserId = await this.getEndUserId(chatSession, liveChatCustomerID, headers);
      const sessionPostData = VARequestMapper.sessionPostData(
        chatSession,
        chatQueueList,
        liveChatCustomerID,
        endUserId
      );
      const responseSession = await MeedAxios.getAxiosInstanceLiveChat().post(
        `livechat/userSession.html`,
        sessionPostData,
        { headers }
      );

      if (!responseSession.data) {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_CREATE_CHAT_SESSION;
        throw new HTTPError(message, errorCode, httpCode);
      }

      return { sessionID: responseSession.data, customerID: liveChatCustomerID };
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {IChatHistory} chatHistory
   * @returns {Promise<any>}
   * @memberof VirtualAssistantService
   */
  static async saveChatHistory(chatHistory: IChatHistory): Promise<IVirtualAssistant> {
    try {
      const response = await MeedAxios.getAxiosInstanceSaveChat().post('', chatHistory);

      if (response.statusText !== 'Accepted') {
        const { message, errorCode, httpCode } = VirtualAssistantErrCodes.UNABLE_TO_SAVE_CHAT_HISTORY;
        throw new HTTPError(message, errorCode, httpCode);
      }

      return VAResponseMapper.vaDTO(response.data) as IVirtualAssistant;
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @private
   * @static
   * @param {*} va
   * @param {string} liveChatCustomerID
   * @param {*} headers
   * @memberof VirtualAssistantService
   */
  private static async getEndUserId(
    chatSession: IChatSession,
    liveChatCustomerID: string,
    headers: any
  ): Promise<number> {
    const localUserDataRes = await MeedAxios.getAxiosInstanceLiveChat().get(
      `livechat/localUserData.html`,
      {
        params: {
          emaiId: chatSession.email,
          custId: liveChatCustomerID
        }
      },
      { headers }
    );

    if (localUserDataRes.data > 0) {
      return localUserDataRes.data;
    }

    const postData = VARequestMapper.localUserData(chatSession, liveChatCustomerID);
    const responseCreateLocalUserData = await MeedAxios.getAxiosInstanceLiveChat().post(
      `livechat/localUserData.html`,
      postData,
      { headers }
    );

    return responseCreateLocalUserData.data;
  }

  /**
   * @private
   * @static
   * @param {*} language
   * @param {*} responseQueueStateVOList
   * @returns
   * @memberof VirtualAssistantService
   */
  private static getQueueInfo(language: string, responseQueueStateVOList: any): any {
    let _getResQueueInfo = responseQueueStateVOList[0];
    const _getSystemQueueInfo = config.virtualAssistance.queues.find(queue => queue.language === language);
    if (_getSystemQueueInfo) {
      _getResQueueInfo = responseQueueStateVOList.find(queue => queue.queueName === _getSystemQueueInfo.queueName);
    }
    return _getResQueueInfo;
  }

  /**
   * Determine the chat type and return paramters
   * @private
   * @static
   * @param {IVAData} chatData
   * @returns {object}
   * @memberof VirtualAssistantService
   */
  private static getChatParams(virtualAssistant: IVAData): object {
    const commonParams = {
      type: 'json',
      ident: virtualAssistant.ident,
      userlogid: virtualAssistant.userlogid,
      channel: virtualAssistant.channel,
      businessArea: virtualAssistant.business_area
    };

    // this is a faq type chat
    if (virtualAssistant.answer_id && virtualAssistant.recognition_id) {
      return {
        ...commonParams,
        FAQRequest: virtualAssistant.entry,
        RECOGNITION_ID: virtualAssistant.recognition_id,
        ANSWER_ID: virtualAssistant.answer_id,
        FAQ: 1
      };
    }

    return { ...commonParams, entry: virtualAssistant.entry };
  }

  /**
   * @private
   * @static
   * @param {string} language
   * @returns {string}
   * @memberof VirtualAssistantService
   */
  private static getBusinessarea(language: string): string {
    switch (language) {
      case 'es_MX':
        return Businessarea.Spanish;
      case 'en_US':
      default:
        return Businessarea.English;
    }
  }
}
