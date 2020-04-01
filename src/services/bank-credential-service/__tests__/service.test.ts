import request from 'supertest';
import querystring from 'querystring';

import config from '../../../config/config';
import app from '../../../app';
import {
  MockForgotUsername,
  mockAccessTokenResponse,
  MockUsername,
  MockChallengeQuestion,
  MockChallengeQTemplate,
  MockValidateData,
  MockResetPass
} from './mocks/mock-data';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import BankCredentialService from '../service';
import { MeedService } from '../../meedservice/service';

jest.mock('axios');
import axios from 'axios';
import { mockMember } from '../../bank-login-service/__tests__/mocks/mock-data';

describe('Bank Credential Service', () => {
  jest.setTimeout(5000);

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Forgot Username (API)', () => {
    const mockReponse = {
      data: { Message: 'Username mock recovery done' }
    };

    beforeEach(() => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockReponse)
        .mockRejectedValue(new Error('Should not call more than twice'));
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
      (axios.create().put as jest.Mock).mockReset();
    });

    it('should return 400 when no email', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'forgotUsername');
      const spyMember = jest.spyOn(MeedService, 'findMemberByEmail');
      spyMember.mockResolvedValue(mockMember as any);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-username`)
        .send({})
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"email" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();

      spy.mockRestore();
      spyMember.mockRestore();
    });

    it('should return 200 (API)', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'forgotUsername');
      const spyMember = jest.spyOn(MeedService, 'findMemberByEmail');
      spyMember.mockResolvedValue(mockMember as any);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-username`)
        .send(MockForgotUsername)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReponse.data.Message);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(MockForgotUsername.email);
      // getaccess token and to bank forgot username url
      expect(axios.create().post).toBeCalledTimes(2);

      spy.mockRestore();
      spyMember.mockRestore();
    });
  });

  describe('Get Challenge Question (API)', () => {
    beforeEach(() => {
      (axios.create().post as jest.Mock).mockResolvedValueOnce(mockAccessTokenResponse);
      (axios.create().get as jest.Mock).mockResolvedValueOnce(MockChallengeQTemplate);
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
    });

    it('should return 400 without query/username', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'getChallengeQuestions');
      const spyMember = jest.spyOn(MeedService, 'findMemberByUsername');
      spyMember.mockResolvedValue(mockMember as any);

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/challenge-questions`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"username" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
      spyMember.mockRestore();
    });

    it('should return 200 and expected question', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'getChallengeQuestions');
      const spyMember = jest.spyOn(MeedService, 'findMemberByUsername');
      spyMember.mockResolvedValue(mockMember as any);

      const response = await request(app)
        .get(
          `${config.app.baseUrl}v1.0.0/credentials/forgot-password/challenge-questions?${querystring.encode({
            username: MockUsername
          })}`
        )
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(MockChallengeQuestion);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(MockUsername);
      expect(axios.create().post).toBeCalledTimes(1);
      expect(axios.create().get).toBeCalledTimes(1);

      spy.mockRestore();
      spyMember.mockRestore();
    });
  });

  describe('Validate Challenge Question (API)', () => {
    beforeEach(() => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(MockChallengeQTemplate);
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
    });

    it('should return 400 without username', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'validateChallengeQuestions');
      const { username, ...NoUsername } = MockValidateData;

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/challenge-questions`)
        .send(NoUsername)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"username" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
    });

    it('should return 400 without answers', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'validateChallengeQuestions');
      const { answers, ...NoAnswer } = MockValidateData;

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/challenge-questions`)
        .send(NoAnswer)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"answers" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
    });

    it('should return 400 without answer', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'validateChallengeQuestions');
      const { key, ...NoKey } = MockValidateData;

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/challenge-questions`)
        .send(NoKey)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"key" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
    });

    it('should return 200', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'validateChallengeQuestions');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/challenge-questions`)
        .send(MockValidateData)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(MockChallengeQuestion);
      expect(spy).toBeCalledTimes(1);
      expect(axios.create().post).toBeCalledTimes(2);

      spy.mockRestore();
    });
  });

  describe('Reset password (API)', () => {
    beforeEach(() => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce({ data: { Message: 'Mock Password reset successfully' } });
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
    });

    it('should return 400 without username', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'resetPassword');
      const { username, ...NoUsername } = MockResetPass;

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/reset`)
        .send(NoUsername)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"username" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
    });

    it('should return 400 without password', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'resetPassword');
      const { password, ...NoPassword } = MockResetPass;

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/reset`)
        .send(NoPassword)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"password" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
    });

    it('should return 400 without key', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'resetPassword');
      const { key, ...NoKey } = MockResetPass;

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/reset`)
        .send(NoKey)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"key" is required');
      expect(spy).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(axios.create().get).not.toBeCalled();

      spy.mockRestore();
    });

    it('should return 200 and reset password', async () => {
      const spy = jest.spyOn(BankCredentialService.prototype, 'resetPassword');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/credentials/forgot-password/reset`)
        .send(MockResetPass)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(response.body).toEqual('Mock Password reset successfully');
      expect(spy).toBeCalledTimes(1);
      expect(axios.create().post).toBeCalledTimes(2);

      spy.mockRestore();
    });
  });
});
