import request from 'supertest';
jest.mock('axios');
import axios from 'axios';

import {
  mockLogin,
  mockMember,
  mockStaticData,
  mockAccessTokenResponse,
  mockBank,
  mockPreAccountSummary
} from './mocks/mock-data';

import config from '../../../config/config';
import app from '../../../app';

import { MemberService } from '../../meedservice/atomic-services/member';
import { StaticDataRepository } from '../../meedservice/repository/static-data';
import { AxErrorCodes } from '../../bank-credential-service/errors';

beforeAll(() => {
  (axios.create().post as jest.Mock).mockImplementation(url => {
    switch (url) {
      case '/token':
        return Promise.resolve({ ...mockAccessTokenResponse });
      case `/login/${config.api.axxiome.version}/login`:
        return Promise.resolve({
          headers: {
            'x-axxiome-digital-token': 'mockbanktokenitis'
          }
        });
      default:
        return Promise.reject(`No mock data for POST ${url}`);
    }
  });

  (axios.create().get as jest.Mock).mockImplementation(url => {
    switch (url) {
      case `/account/2.3.0/accountsummary`:
        return Promise.resolve({ data: mockPreAccountSummary });
      default:
        return Promise.reject(`No mock data for GET ${url}`);
    }
  });
});

describe('Bank Login Service', () => {
  jest.setTimeout(5000);
  let spyMember;
  let spyStaticRepo;

  beforeEach(() => {
    spyMember = jest.spyOn(MemberService, 'findOne');
    spyStaticRepo = jest.spyOn(StaticDataRepository.prototype, 'find');
    spyMember.mockImplementation(() => Promise.resolve({ ...mockMember }));
    spyStaticRepo.mockImplementation(() => Promise.resolve({ ...mockStaticData }));

    (axios.create().post as jest.Mock).mockClear();
    (axios.create().get as jest.Mock).mockClear();
  });

  afterEach(() => {
    spyMember.mockRestore();
    spyStaticRepo.mockRestore();
  });

  describe('With valid credential', () => {
    it('Should successfully login with accountSummary when registration is completed', async () => {
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/login`)
        .send(mockLogin)
        .set('Content-Type', 'application/json');

      expect(spyMember).toBeCalledWith(
        { username: { $options: 'i', $regex: mockLogin.username } },
        null,
        'bank inviter'
      );
      expect(spyStaticRepo).toBeCalledTimes(1);
      expect(axios.create().post as jest.Mock).toBeCalledTimes(3);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.accountSummary).toBeArrayOfSize(3);
      expect(response.header['meedbankingclub-bank-identifier']).toEqual(mockBank.identifier);
    });

    it('Should successfully login without accountSummary when registration is not completed', async () => {
      spyMember.mockReset();
      spyMember.mockImplementation(() =>
        Promise.resolve({ ...mockMember, applicationProgress: 'is-not-completed', applicationStatus: 'not-completed' })
      );

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/login`)
        .send(mockLogin)
        .set('Content-Type', 'application/json');

      expect(spyMember).toBeCalledWith(
        { username: { $options: 'i', $regex: mockLogin.username } },
        null,
        'bank inviter'
      );
      expect(spyStaticRepo).toBeCalledTimes(1);
      expect(axios.create().post as jest.Mock).toBeCalledTimes(3);
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body.accountSummary).toBeUndefined();
      expect(response.header['meedbankingclub-bank-identifier']).toEqual(mockBank.identifier);
    });
  });

  describe('Return 400 validation error WHEN', () => {
    for (const key of Object.keys(mockLogin)) {
      const { [key]: omitted, ...missingProp } = mockLogin as any;

      it(`login credentials has no ${key}`, async () => {
        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/login`)
          .send(missingProp)
          .set('Content-Type', 'application/json');

        expect(spyMember).not.toBeCalled();
        expect(spyStaticRepo).not.toBeCalled();
        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).not.toBeCalled();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`"${key}" is required`);
      });
    }
  });

  describe('Errors', () => {
    afterEach(() => {
      (axios.create().post as jest.Mock).mockRestore();
      (axios.create().post as jest.Mock).mockImplementation(url => {
        switch (url) {
          case '/token':
            return Promise.resolve(mockAccessTokenResponse);
          case `/login/${config.api.axxiome.version}/login`:
            return Promise.resolve({
              headers: {
                'x-axxiome-digital-token': 'mockbanktokenitis'
              }
            });
          default:
            return Promise.reject(`No mock data for POST ${url}`);
        }
      });
    });

    it('Should return 400 when account is locked', async () => {
      (axios.create().post as jest.Mock).mockRestore();
      (axios.create().post as jest.Mock).mockImplementation(url => {
        switch (url) {
          case '/token':
            return Promise.resolve(mockAccessTokenResponse);
          case `/login/${config.api.axxiome.version}/login`:
            return Promise.reject({
              response: {
                status: 401,
                data: {
                  code: 3
                }
              }
            });
          default:
            return Promise.reject(`No mock data for POST ${url}`);
        }
      });

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/login`)
        .send(mockLogin)
        .set('Content-Type', 'application/json');

      expect(spyMember).toBeCalledWith(
        { username: { $options: 'i', $regex: mockLogin.username } },
        null,
        'bank inviter'
      );
      expect(spyStaticRepo).toBeCalledTimes(1);
      expect(axios.create().post as jest.Mock).toBeCalledTimes(2);
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(AxErrorCodes.login.ACCOUNT_IS_LOCKED.message);
    });

    it('Should return 401 when credential is wrong', async () => {
      (axios.create().post as jest.Mock).mockRestore();
      (axios.create().post as jest.Mock).mockImplementation(url => {
        switch (url) {
          case '/token':
            return Promise.resolve(mockAccessTokenResponse);
          case `/login/${config.api.axxiome.version}/login`:
            return Promise.reject({
              response: {
                status: 401,
                data: {
                  code: 1
                }
              }
            });
          default:
            return Promise.reject(`No mock data for POST ${url}`);
        }
      });

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/login`)
        .send(mockLogin)
        .set('Content-Type', 'application/json');

      expect(spyMember).toBeCalledWith(
        { username: { $options: 'i', $regex: mockLogin.username } },
        null,
        'bank inviter'
      );
      expect(spyStaticRepo).toBeCalledTimes(1);
      expect(axios.create().post as jest.Mock).toBeCalledTimes(2);
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(AxErrorCodes.login.INCORRECT_CREDENTIALS.message);
    });

    it('Should return error when no member found', async () => {
      spyMember.mockReset();
      spyMember.mockImplementation(() => Promise.resolve(null));

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/login`)
        .send(mockLogin)
        .set('Content-Type', 'application/json');

      expect(spyMember).toBeCalledWith(
        { username: { $options: 'i', $regex: mockLogin.username } },
        null,
        'bank inviter'
      );
      expect(spyStaticRepo).not.toBeCalled();
      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
    });
  });
});
