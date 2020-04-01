import request from 'supertest';
import querystring from 'querystring';
jest.mock('../../../middleware/authMiddleware.ts');
jest.mock('axios');
import axios from 'axios';

import config from '../../../config/config';
import app from '../../../app';
import { VirtualAssistantErrCodes } from '../errors';
import { VirtualAssistantService } from '../service';
import {
  mockInitRaw,
  mockInit,
  mockLanguage,
  chatSessionReq,
  getAutoSugParams,
  postAutoSugReq,
  saveChatReq,
  dlgTreeReq,
  mockAutoSug,
  chatQueueRaw,
  refreshTokenRaw,
  genChatReq,
  faqChatReq
} from './mock-data';

describe('Virtual Assistant Service', () => {
  jest.setTimeout(5000);

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    (axios.create().post as jest.Mock).mockReset();
    (axios.create().get as jest.Mock).mockReset();
  });

  describe('Initialize Virtual Assistant', () => {
    it('Should return 400 when language is missing in query', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app).get(`${config.app.baseUrl}v1.0.0/virtual-assistant/initialize`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"language" is required');
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_INIT.httpCode} when api returns error`, async () => {
      const mockError = {
        data: {
          info: {
            status: 'error',
            message: 'Mock init message'
          }
        }
      };
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockResolvedValueOnce(mockError).mockRejectedValue('Get should not be called');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/virtual-assistant/initialize?language=${mockLanguage}`
      );

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_INIT.httpCode);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(mockError.data.info.message);
    });

    it('Should return 200 and init data', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInitRaw)
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/virtual-assistant/initialize?language=${mockLanguage}`
      );

      expect(response.status).toBe(200);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.body).toHaveProperty('info');
      expect(response.body).toMatchObject(mockInit);
    });
  });

  describe('Create Live Chat Session', () => {
    test.each(Object.keys(chatSessionReq))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = chatSessionReq as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(restReq);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE.httpCode} when chat queue empty`, async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      (axios.create().get as jest.Mock)
        // step 1: chat queue
        .mockResolvedValueOnce({
          data: {
            queueStateVOList: []
          }
        })
        .mockRejectedValue('No more Get should be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(chatSessionReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE.httpCode);
      expect(response.body.message).toEqual(VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE.message);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE.httpCode} when chat queue not found`, async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      (axios.create().get as jest.Mock)
        // step 1: chat queue
        .mockResolvedValueOnce({
          data: {}
        })
        .mockRejectedValue('No more Get should be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(chatSessionReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE.httpCode);
      expect(response.body.message).toEqual(VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_QUEUE.message);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_REFRESH_TOKEN.httpCode} when refresh token not found`, async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      (axios.create().get as jest.Mock)
        // step 1: chat queue
        .mockResolvedValueOnce(chatQueueRaw)
        // step 2: refresh token
        .mockResolvedValueOnce({})
        .mockRejectedValue('No more Get should be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(chatSessionReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_REFRESH_TOKEN.httpCode);
      expect(response.body.message).toEqual(VirtualAssistantErrCodes.UNABLE_TO_GET_CHAT_REFRESH_TOKEN.message);
    });

    it(`Should return failed when create localUserData throws error`, async () => {
      (axios.create().post as jest.Mock)
        // step 3.2: create localUserData
        .mockRejectedValueOnce({
          response: {
            status: 403
          }
        })
        .mockRejectedValue('No more Post should be called');

      (axios.create().get as jest.Mock)
        // step 1: chat queue
        .mockResolvedValueOnce(chatQueueRaw)
        // step 2: refresh token
        .mockResolvedValueOnce(refreshTokenRaw)
        // step 3.1: get localUserData
        .mockResolvedValueOnce({
          data: -1
        })
        .mockRejectedValue('No more Get should be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(chatSessionReq);

      expect(response.status).toBe(403);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_CREATE_CHAT_SESSION.httpCode} when create session failed`, async () => {
      const userId = 98;

      (axios.create().post as jest.Mock)
        // step 3.2: create localUserData
        .mockResolvedValueOnce({
          data: userId
        })
        // step 4: create sessin
        .mockResolvedValueOnce({})
        .mockRejectedValue('No more Post should be called');

      (axios.create().get as jest.Mock)
        // step 1: chat queue
        .mockResolvedValueOnce(chatQueueRaw)
        // step 2: refresh token
        .mockResolvedValueOnce(refreshTokenRaw)
        // step 3.1: get localUserData
        .mockResolvedValueOnce({
          data: -1
        })
        .mockRejectedValue('No more Get should be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(chatSessionReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_CREATE_CHAT_SESSION.httpCode);
      expect(response.body.message).toBe(VirtualAssistantErrCodes.UNABLE_TO_CREATE_CHAT_SESSION.message);
    });

    it(`Should return 200 and session data`, async () => {
      const sessionId = 1570;
      const userId = 98;

      (axios.create().post as jest.Mock)
        // create localUserData
        .mockResolvedValueOnce({
          data: userId
        })
        // create sessin
        .mockResolvedValueOnce({
          data: sessionId
        })
        .mockRejectedValue('No more Post should be called');

      (axios.create().get as jest.Mock)
        // chat queue
        .mockResolvedValueOnce(chatQueueRaw)
        // refresh token
        .mockResolvedValueOnce(refreshTokenRaw)
        // get localUserData
        .mockResolvedValueOnce({
          data: -1
        })
        .mockRejectedValue('No more Get should be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/session`)
        .send(chatSessionReq);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        sessionID: sessionId,
        customerID: config.virtualAssistance.liveChatCustomerID
      });
    });
  });

  describe('Get Auto Suggestions', () => {
    test.each(Object.keys(getAutoSugParams))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restParams } = getAutoSugParams as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/virtual-assistant/autosuggest?${querystring.encode(restParams)}`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it('Should return empty array when no suggestions found', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce({
          data: {}
        })
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/virtual-assistant/autosuggest?${querystring.encode(getAutoSugParams)}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('Should return auto suggestions', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            AutoCompleteInfo: {
              AutoComplete: mockAutoSug
            }
          }
        })
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/virtual-assistant/autosuggest?${querystring.encode(getAutoSugParams)}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAutoSug);
    });
  });

  describe('Post Auto Suggestions', () => {
    test.each(Object.keys(postAutoSugReq))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restData } = postAutoSugReq as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/autosuggest`)
        .send(restData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it('Should submit auto suggestion and return 200', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInitRaw)
        .mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/autosuggest`)
        .send(postAutoSugReq);

      expect(response.status).toBe(200);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.body).toEqual(mockInit);
    });
  });

  describe('Save Chat History', () => {
    test.each(Object.keys(saveChatReq))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restData } = saveChatReq as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/save`)
        .send(restData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_SAVE_CHAT_HISTORY.httpCode} when not accepted`, async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          statusText: 'Denied',
          data: null
        })
        .mockRejectedValue('Post should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/save`)
        .send(saveChatReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_SAVE_CHAT_HISTORY.httpCode);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(VirtualAssistantErrCodes.UNABLE_TO_SAVE_CHAT_HISTORY.message);
    });

    it(`Should save history and return 200`, async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          statusText: 'Accepted',
          data: mockInitRaw.data
        })
        .mockRejectedValue('Post should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat/save`)
        .send(saveChatReq);

      expect(response.status).toBe(200);
      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(response.body).toEqual(mockInit);
    });
  });

  describe('Submit dialogue tree', () => {
    test.each(Object.keys(dlgTreeReq))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restData } = dlgTreeReq as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/dialogue-tree`)
        .send(restData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it('Should submit dialogue tree and return 200', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInitRaw)
        .mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/dialogue-tree`)
        .send(dlgTreeReq);

      expect(response.status).toBe(200);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.body).toEqual(mockInit);
    });
  });

  describe('FAQ Chat', () => {
    test.each(Object.keys(faqChatReq))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restData } = faqChatReq as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat`)
        .send(restData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"value" does not match any of the allowed types`);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_GET_RESPONSE_FAQ.httpCode} status is not success`, async () => {
      const mockError = {
        data: {
          info: {
            status: 'error',
            message: 'mockfaqerror'
          }
        }
      };

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockError)
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat`)
        .send(faqChatReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_GET_RESPONSE_FAQ.httpCode);
      expect(response.body.message).toEqual(mockError.data.info.message);
    });

    it('Should return 200', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInitRaw)
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat`)
        .send(faqChatReq);

      expect(response.status).toBe(200);
    });
  });

  describe('GENERAL Chat', () => {
    test.each(Object.keys(genChatReq))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restData } = genChatReq as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat`)
        .send(restData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"value" does not match any of the allowed types`);
    });

    it(`Should return ${VirtualAssistantErrCodes.UNABLE_TO_GET_ANSWER.httpCode} status is not success`, async () => {
      const mockError = {
        data: {
          info: {
            status: 'error',
            message: 'mock feneral error'
          }
        }
      };

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockError)
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat`)
        .send(genChatReq);

      expect(response.status).toBe(VirtualAssistantErrCodes.UNABLE_TO_GET_ANSWER.httpCode);
      expect(response.body.message).toEqual(mockError.data.info.message);
    });

    it('Should return 200', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInitRaw)
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/virtual-assistant/chat`)
        .send(genChatReq);

      expect(response.status).toBe(200);
    });
  });
});
