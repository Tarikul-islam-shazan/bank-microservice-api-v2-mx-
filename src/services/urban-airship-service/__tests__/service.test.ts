import request from 'supertest';
import querystring from 'querystring';
jest.mock('../../../middleware/authMiddleware.ts');
jest.mock('axios');
import axios from 'axios';

import config from '../../../config/config';
import app from '../../../app';
import { uasErrCodes } from '../errors/uasErrors';

describe('Virtual Assistant Service', () => {
  jest.setTimeout(5000);

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    (axios.create().post as jest.Mock).mockReset();
    (axios.create().put as jest.Mock).mockReset();
    (axios.create().delete as jest.Mock).mockReset();
    (axios.create().get as jest.Mock).mockReset();
  });

  describe('Register email address to email channel', () => {
    const mockRegEmail = {
      type: 'email',
      address: 'meed.test@yopmail.com',
      timezone: 'America/Los_Angeles',
      locale_country: 'US',
      locale_language: 'en'
    };

    test.each(Object.keys(mockRegEmail))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = mockRegEmail as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/email-channel`)
        .send({ channel: restReq });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"channel.${key}" is required`);
    });

    it(`Should return 200 and register email`, async () => {
      const mockReponse = {
        ok: true,
        channel_id: 'ed83d48b-c418-44c2-998c-08eea4844478'
      };
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          data: mockReponse
        })
        .mockRejectedValue('Post should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/email-channel`)
        .send({ channel: mockRegEmail });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });

  describe('Update email channel', () => {
    const mockUpdateEmail = {
      type: 'email',
      address: 'meed.test@yopmail.com',
      channelID: 'ed83d48b-c418-44c2-998c-08eea4844478',
      commercial_opted_in: '2018-10-28T10:34:22'
    };

    test.each(Object.keys(mockUpdateEmail))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = mockUpdateEmail as any;

      (axios.create().put as jest.Mock).mockRejectedValue('Put should not be called');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/uas/email-channel`)
        .send({ channel: restReq });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"channel.${key}" is required`);
    });

    it(`Should return 200 and update email channel`, async () => {
      const mockReponse = {
        ok: true,
        channel_id: 'ed83d48b-c418-44c2-998c-08eea4844478'
      };
      (axios.create().put as jest.Mock)
        .mockResolvedValueOnce({
          data: mockReponse
        })
        .mockRejectedValue('Put should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/uas/email-channel`)
        .send({ channel: mockUpdateEmail });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });

  describe('Associate named user to email channel', () => {
    const mockNameuser = {
      channel_id: 'ed83d48b-c418-44c2-998c-08eea4844478',
      named_user_id: '0000006991'
    };

    test.each(Object.keys(mockNameuser))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = mockNameuser as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/named-user`)
        .send(restReq);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it(`Should return 200 and associate named user`, async () => {
      const mockReponse = { ok: true };
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          data: mockReponse
        })
        .mockRejectedValue('post should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/named-user`)
        .send(mockNameuser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });

  describe('Named user look up', () => {
    const mockLookUp = {
      namedUser: '0000006991'
    };

    it(`Should return 400 when namedUser is missing`, async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');

      const response = await request(app).get(`${config.app.baseUrl}v1.0.0/uas/named-user`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"namedUser" is required`);
    });

    it(`Should return ${uasErrCodes.NO_NAMED_ID_ASSOCIATED.httpCode} when namedUser not found`, async () => {
      (axios.create().get as jest.Mock)
        .mockRejectedValueOnce({
          response: {
            status: 404
          }
        })
        .mockRejectedValue('Get should not be called more than once');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/uas/named-user?${querystring.encode(mockLookUp)}`
      );

      expect(response.status).toBe(uasErrCodes.NO_NAMED_ID_ASSOCIATED.httpCode);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(uasErrCodes.NO_NAMED_ID_ASSOCIATED.message);
    });

    it(`Should return 200 and named user detail`, async () => {
      const mockReponse = {
        tags: ['meed_push', 'meed_email'],
        channelId: 'ed83d48b-c418-44c2-998c-08eea4844478'
      };
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            named_user: {
              tags: {
                meed_opt_in: mockReponse.tags
              },
              channels: [
                {
                  channel_id: mockReponse.channelId,
                  device_type: 'email'
                }
              ]
            }
          }
        })
        .mockRejectedValue('get should not be called more than once');

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/uas/named-user?${querystring.encode(mockLookUp)}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });

  describe('Add initial tags', () => {
    const mockInitTags = {
      namedUser: '0000006991',
      banks: ['axiomme']
    };

    test.each(Object.keys(mockInitTags))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = mockInitTags as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/named-user/initial-tags`)
        .send(restReq);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it(`Should return 200 and add default tags`, async () => {
      const mockReponse = { ok: true };
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          data: mockReponse
        })
        .mockRejectedValue('post should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/named-user/initial-tags`)
        .send(mockInitTags);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });

  describe('Add a tag', () => {
    const mockAddTags = {
      namedUser: '0000006991',
      tag: 'meed_push2'
    };

    test.each(Object.keys(mockAddTags))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = mockAddTags as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/named-user/tags`)
        .send(restReq);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it(`Should return 200 and add a tag`, async () => {
      const mockReponse = { ok: true };
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          data: mockReponse
        })
        .mockRejectedValue('post should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/uas/named-user/tags`)
        .send(mockAddTags);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });

  describe('Remove a tag', () => {
    const mockRemoveTags = {
      namedUser: '0000006991',
      tag: 'meed_push2'
    };

    test.each(Object.keys(mockRemoveTags))(`Should return 400 when %s is missing`, async key => {
      const { [key]: ommited, ...restReq } = mockRemoveTags as any;

      (axios.create().post as jest.Mock).mockRejectedValue('Post should not be called');

      const response = await request(app)
        .delete(`${config.app.baseUrl}v1.0.0/uas/named-user/tags`)
        .send(restReq);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"${key}" is required`);
    });

    it(`Should return 200 and remove a tag`, async () => {
      const mockReponse = { ok: true };
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce({
          data: mockReponse
        })
        .mockRejectedValue('post should not be called more than once');

      const response = await request(app)
        .delete(`${config.app.baseUrl}v1.0.0/uas/named-user/tags`)
        .send(mockRemoveTags);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse);
    });
  });
});
