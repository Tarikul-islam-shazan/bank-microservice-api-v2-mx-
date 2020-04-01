import request from 'supertest';
import querystring from 'querystring';

jest.mock('../../../middleware/authMiddleware');
jest.mock('axios');
import axios from 'axios';

import config from '../../../config/config';
import app from '../../../app';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import {
  mockAccessTokenResponse,
  mockUnstructuredAccountSummary,
  mockAccountSummary,
  mockUnstructuredTransactions,
  mockTransactions
} from './mocks/mock-data';

describe('Bank Account Service', () => {
  jest.setTimeout(5000);

  beforeEach(() => {
    (axios.create().post as jest.Mock)
      .mockResolvedValueOnce(mockAccessTokenResponse)
      .mockRejectedValue('Post Should not be called more than once');
  });

  afterEach(() => {
    (axios.create().post as jest.Mock).mockReset();
    (axios.create().get as jest.Mock).mockReset();
  });

  describe('Get Account Summary', () => {
    it('Should return api error when get unknown error', async () => {
      const unknownError = { response: { status: 409, data: 'Unknown summary error' } };
      (axios.create().get as jest.Mock)
        .mockRejectedValueOnce(unknownError)
        .mockRejectedValue('Get Should not be called more than once');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/bank/accounts`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(unknownError.response.status);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(unknownError.response.data);
    });

    it('Should return 200 and account summary', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce({ data: mockUnstructuredAccountSummary })
        .mockRejectedValue('Should not be called');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/bank/accounts`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accounts');
      expect(response.body.accounts).toBeArrayOfSize(3);
      expect(response.body.accounts).toEqual(mockAccountSummary);
    });
  });

  describe('Get Account Transactions', () => {
    const mockAccountId = mockUnstructuredTransactions.Data.Transaction[0].AccountId;
    beforeEach(() => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce({ data: mockUnstructuredTransactions })
        .mockRejectedValue('Get Should not be called more than once');
    });

    it('Should return api error on unknown error', async () => {
      const unknownError = { response: { status: 412, data: 'Unknown error' } };
      (axios.create().get as jest.Mock).mockReset();
      (axios.create().get as jest.Mock)
        .mockRejectedValueOnce(unknownError)
        .mockRejectedValue('Get Should not be called more than once');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/bank/accounts/${mockAccountId}/transactions`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(unknownError.response.status);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(unknownError.response.data);
    });

    it('Should return 200 and empty response when no transaction found', async () => {
      const notFoundError = { response: { status: 404 } };
      (axios.create().get as jest.Mock).mockReset();
      (axios.create().get as jest.Mock)
        .mockRejectedValueOnce(notFoundError)
        .mockRejectedValue('Get Should not be called more than once');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/bank/accounts/${mockAccountId}/transactions`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('postedTransactions');
      expect(response.body).toHaveProperty('pendingTransactions');
      expect(response.body.postedTransactions).toBeArrayOfSize(0);
      expect(response.body.pendingTransactions).toBeArrayOfSize(0);
    });

    it('Should return 200 when without search query (Line Of Credit)', async () => {
      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/bank/accounts/${mockAccountId}/transactions`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('postedTransactions');
      expect(response.body).toHaveProperty('pendingTransactions');
      expect(response.body).toEqual(mockTransactions);
    });

    it('Should return 200 when with search query (Advance Search)', async () => {
      const response = await request(app)
        .get(
          `${config.app.baseUrl}v1.0.0/bank/accounts/${mockAccountId}/transactions?${querystring.encode({
            dateFrom: '09-25-2019 01:00:00.0000',
            dateTo: '09-25-2019 01:00:00.0000'
          })}`
        )
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('postedTransactions');
      expect(response.body).toHaveProperty('pendingTransactions');
      expect(response.body).toEqual(mockTransactions);
    });
  });
});
