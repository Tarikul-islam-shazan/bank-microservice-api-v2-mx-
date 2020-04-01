import request from 'supertest';

import {
  mockImmediate,
  mockSchedule,
  mockWeekly,
  mockMonthly,
  mockYearly,
  mockAccessTokenResponse,
  mockScheduleList,
  mockRecurList,
  mockTransferList,
  makeMockError
} from './mocks/mock-data';

import {
  ImmediateTransferStrategy,
  ScheduledTransferStrategy,
  RecurringTransferStrategy
} from '../strategy/ax-strategy';

import config from '../../../config/config';
import app from '../../../app';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import { TransferUtil } from '../util/util';
import { TransferType } from '../../models/internal-transfer/interface';
import { TransferController } from '../controller';
import { TransferErrorCodes } from '../errors';

jest.mock('../../../middleware/authMiddleware');
jest.mock('axios');
import axios from 'axios';
import moment from 'moment';
import { mockUnstructuredAccountSummary } from '../../account-service/__tests__/mocks/mock-data';

describe('Internal Transfer Service', () => {
  jest.setTimeout(5000);

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Transfer Request Validation (API)', () => {
    let spyController;

    beforeEach(() => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockImmediate.response);
      spyController = jest.spyOn(TransferController, 'transfer');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      spyController.mockRestore();
    });

    it('Should return 400 without body', async () => {
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({})
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyController).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"debtorAccount" is required');
    });

    it('Should return 400 without debtorAccount', async () => {
      const { debtorAccount, ...noDebtor } = mockImmediate.request;
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(noDebtor)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyController).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"debtorAccount" is required');
    });

    it('Should return 400 without creditorAccount', async () => {
      const { creditorAccount, ...noCreditor } = mockImmediate.request;
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(noCreditor)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyController).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"creditorAccount" is required');
    });

    it('Should return 400 without amount', async () => {
      const { amount, ...noAmount } = mockImmediate.request;
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(noAmount)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyController).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"amount" is required');
    });

    it('Should return 400 without currency', async () => {
      const { currency, ...nocurrency } = mockImmediate.request;
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(nocurrency)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyController).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"currency" is required');
    });

    it('Should return 200 without optional notes', async () => {
      const { notes, ...nonotes } = mockImmediate.request;
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(nonotes)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(axios.create().post).toBeCalled();
      expect(response.status).toBe(200);
    });

    it('Should return 400 without frequency', async () => {
      const { frequency, ...nofrequency } = mockImmediate.request;
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(nofrequency)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyController).not.toBeCalled();
      expect(axios.create().post).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"frequency" is required');
    });
  });

  describe('Transfer (API)', () => {
    let spyImmediate;
    let spySchedule;
    let spyRecur;
    let spyUtil;

    beforeEach(() => {
      spyImmediate = jest.spyOn(ImmediateTransferStrategy.prototype, 'transfer');
      spySchedule = jest.spyOn(ScheduledTransferStrategy.prototype, 'transfer');
      spyRecur = jest.spyOn(RecurringTransferStrategy.prototype, 'transfer');
      spyUtil = jest.spyOn(TransferUtil, 'getTransferType');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      spyImmediate.mockRestore();
      spySchedule.mockRestore();
      spyRecur.mockRestore();
      spyUtil.mockRestore();
    });

    it('Immediate transfer should return 200', async () => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockImmediate.response);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(mockImmediate.request)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(spyUtil).toBeCalled();
      expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
      expect(spyImmediate).toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(axios.create().post).toBeCalledTimes(2);
      expect(response.body).toContainKeys(['transferId', 'transferType', ...Object.keys(mockImmediate.request)]);
      expect(response.body.transferType).toEqual(TransferType.Immediate);
      expect(response.body.transferId).toEqual(mockImmediate.response.data.Data.DomesticPaymentId);
    });

    it('Schedule transfer should return 200', async () => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockSchedule.response);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(mockSchedule.request)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(spyUtil).toBeCalled();
      expect(spyUtil).toHaveReturnedWith(TransferType.Scheduled);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(axios.create().post).toBeCalledTimes(2);
      expect(response.body).toContainKeys(['transferId', 'transferType', ...Object.keys(mockSchedule.request)]);
      expect(response.body.transferType).toEqual(TransferType.Scheduled);
      expect(response.body.transferId).toEqual(mockSchedule.response.data.Data.DomesticScheduledPaymentId);
    });

    it('Recurring Weekly transfer should return 200', async () => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockWeekly.response);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(mockWeekly.request)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(spyUtil).toBeCalled();
      expect(spyUtil).toHaveReturnedWith(TransferType.Recurring);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).toBeCalled();
      expect(axios.create().post).toBeCalledTimes(2);
      expect(response.body).toContainKeys(['transferId', 'transferType', ...Object.keys(mockWeekly.request)]);
      expect(response.body.transferType).toEqual(TransferType.Recurring);
      expect(response.body.transferId).toEqual(mockWeekly.response.data.Data.DomesticStandingOrderId);
    });

    it('Recurring Monthly transfer should return 200', async () => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockMonthly.response);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(mockMonthly.request)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(spyUtil).toBeCalled();
      expect(spyUtil).toHaveReturnedWith(TransferType.Recurring);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).toBeCalled();
      expect(axios.create().post).toBeCalledTimes(2);
      expect(response.body).toContainKeys(['transferId', 'transferType', ...Object.keys(mockMonthly.request)]);
      expect(response.body.transferType).toEqual(TransferType.Recurring);
      expect(response.body.transferId).toEqual(mockMonthly.response.data.Data.DomesticStandingOrderId);
    });

    it('Recurring Yearly transfer should return 200', async () => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockYearly.response);

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send(mockYearly.request)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(response.status).toBe(200);
      expect(spyUtil).toBeCalled();
      expect(spyUtil).toHaveReturnedWith(TransferType.Recurring);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).toBeCalled();
      expect(axios.create().post).toBeCalledTimes(2);
      expect(response.body).toContainKeys(['transferId', 'transferType', ...Object.keys(mockYearly.request)]);
      expect(response.body.transferType).toEqual(TransferType.Recurring);
      expect(response.body.transferId).toEqual(mockYearly.response.data.Data.DomesticStandingOrderId);
    });
  });

  describe('Get Transfer List (API)', () => {
    let spyImmediate;
    let spySchedule;
    let spyRecur;

    beforeEach(() => {
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockAccessTokenResponse);
      spyImmediate = jest.spyOn(ImmediateTransferStrategy.prototype, 'getTransfers');
      spySchedule = jest.spyOn(ScheduledTransferStrategy.prototype, 'getTransfers');
      spyRecur = jest.spyOn(RecurringTransferStrategy.prototype, 'getTransfers');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
      spyImmediate.mockRestore();
      spySchedule.mockRestore();
      spyRecur.mockRestore();
    });

    it('Should return empty array when no transfer list', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce({ ...mockUnstructuredAccountSummary })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(response.status).toBe(200);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).toBeCalled();
      expect(spyRecur).toBeCalled();
      expect(axios.create().post).toBeCalledTimes(3);
      expect(axios.create().get).toBeCalledTimes(3);
      expect(response.body).toEqual([]);
    });
  });

  describe('Modify Transfer (API)', () => {
    let spyImmediate;
    let spySchedule;
    let spyRecur;
    let spyUtil;
    let spyImmediateDelete;
    let spyScheduleDelete;
    let spyRecurDelete;

    beforeEach(() => {
      (axios.create().post as jest.Mock).mockResolvedValue(mockAccessTokenResponse);
      spyImmediate = jest.spyOn(ImmediateTransferStrategy.prototype, 'modifyTransfer');
      spySchedule = jest.spyOn(ScheduledTransferStrategy.prototype, 'modifyTransfer');
      spyRecur = jest.spyOn(RecurringTransferStrategy.prototype, 'modifyTransfer');
      spyImmediateDelete = jest.spyOn(ImmediateTransferStrategy.prototype, 'deleteTransfer');
      spyScheduleDelete = jest.spyOn(ScheduledTransferStrategy.prototype, 'deleteTransfer');
      spyRecurDelete = jest.spyOn(RecurringTransferStrategy.prototype, 'deleteTransfer');
      spyUtil = jest.spyOn(TransferUtil, 'getTransferType');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().put as jest.Mock).mockReset();
      (axios.create().patch as jest.Mock).mockReset();
      (axios.create().delete as jest.Mock).mockReset();
      spyImmediate.mockRestore();
      spySchedule.mockRestore();
      spyRecur.mockRestore();
      spyImmediateDelete.mockRestore();
      spyScheduleDelete.mockRestore();
      spyRecurDelete.mockRestore();
      spyUtil.mockRestore();
    });

    it('Should return 400 when transferId missing', async () => {
      (axios.create().put as jest.Mock).mockResolvedValueOnce([]);

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockImmediate.request
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(spyUtil).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"transferId" is required');
    });

    it('Should return 400 when previousTransferType missing', async () => {
      (axios.create().put as jest.Mock).mockResolvedValueOnce([]);

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockImmediate.request,
          transferId: mockTransferList[0].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(spyUtil).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('"previousTransferType" is required');
    });

    it('Should return 403 when try to modify immediate transfer', async () => {
      (axios.create().put as jest.Mock).mockResolvedValueOnce([]);

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockImmediate.request,
          previousTransferType: TransferType.Immediate,
          transferId: mockTransferList[0].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyUtil).toReturnWith(TransferType.Immediate);
      expect(spyImmediate).toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Immediate Transfers cannot be modified');
    });

    it('Should modify existing scheduled transfer when new changes is also scheduled', async () => {
      (axios.create().put as jest.Mock).mockResolvedValueOnce(mockSchedule.response);

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockSchedule.request,
          previousTransferType: TransferType.Scheduled,
          transferId: mockTransferList[1].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyUtil).toReturnWith(TransferType.Scheduled);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body.transferDate).toEqual(moment(mockSchedule.request.transferDate).format('YYYY-MM-DD'));
    });

    it('Should modify existing recurring transfer when new changes is also recurring', async () => {
      (axios.create().put as jest.Mock).mockResolvedValueOnce(mockWeekly.response);

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockWeekly.request,
          previousTransferType: TransferType.Recurring,
          transferId: mockTransferList[0].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyUtil).toReturnWith(TransferType.Recurring);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body.transferDate).toEqual(moment(mockWeekly.request.transferDate).format('YYYY-MM-DD'));
    });

    it('Should modify from scheduled to immediate', async () => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockImmediate.response);
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);
      const spyImmidaiteTransfer = jest.spyOn(ImmediateTransferStrategy.prototype, 'transfer');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockImmediate.request,
          previousTransferType: TransferType.Scheduled,
          transferId: mockTransferList[1].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(axios.create().put as jest.Mock).not.toBeCalled();
      expect(spyUtil).toReturnWith(TransferType.Immediate);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(spyScheduleDelete).toBeCalled();
      expect(spyImmidaiteTransfer).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.transferType).toEqual(TransferType.Immediate);

      spyImmidaiteTransfer.mockRestore();
    });

    it('Should modify from recurring to immediate', async () => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockImmediate.response);
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);
      const spyImmidaiteTransfer = jest.spyOn(ImmediateTransferStrategy.prototype, 'transfer');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockImmediate.request,
          previousTransferType: TransferType.Recurring,
          transferId: mockTransferList[0].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(axios.create().put as jest.Mock).not.toBeCalled();
      expect(spyUtil).toReturnWith(TransferType.Immediate);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(spyRecurDelete).toBeCalled();
      expect(spyImmidaiteTransfer).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.transferType).toEqual(TransferType.Immediate);

      spyImmidaiteTransfer.mockRestore();
    });

    it('Should modify from recurring to schedule', async () => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockSchedule.response);
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);
      const spyScheduleTransfer = jest.spyOn(ScheduledTransferStrategy.prototype, 'transfer');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockSchedule.request,
          previousTransferType: TransferType.Recurring,
          transferId: mockTransferList[1].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(axios.create().put as jest.Mock).not.toBeCalled();
      expect(spyUtil).toReturnWith(TransferType.Scheduled);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(spyRecurDelete).toBeCalled();
      expect(spyScheduleTransfer).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.transferType).toEqual(TransferType.Scheduled);

      spyScheduleTransfer.mockReset();
    });

    it('Should modify from schedule to recurring', async () => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().post as jest.Mock)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockAccessTokenResponse)
        .mockResolvedValueOnce(mockWeekly.response);
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);
      const spyRecurTransfer = jest.spyOn(RecurringTransferStrategy.prototype, 'transfer');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          ...mockWeekly.request,
          previousTransferType: TransferType.Scheduled,
          transferId: mockTransferList[1].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(axios.create().put as jest.Mock).not.toBeCalled();
      expect(spyUtil).toReturnWith(TransferType.Recurring);
      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(spyScheduleDelete).toBeCalled();
      expect(spyRecurTransfer).toBeCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body.transferType).toEqual(TransferType.Recurring);

      spyRecurTransfer.mockReset();
    });
  });

  describe('Delete Transfer (API)', () => {
    let spyImmediate;
    let spySchedule;
    let spyRecur;

    beforeEach(() => {
      (axios.create().post as jest.Mock).mockResolvedValue(mockAccessTokenResponse);
      spyImmediate = jest.spyOn(ImmediateTransferStrategy.prototype, 'deleteTransfer');
      spySchedule = jest.spyOn(ScheduledTransferStrategy.prototype, 'deleteTransfer');
      spyRecur = jest.spyOn(RecurringTransferStrategy.prototype, 'deleteTransfer');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().delete as jest.Mock).mockReset();
      spyImmediate.mockRestore();
      spySchedule.mockRestore();
      spyRecur.mockRestore();
    });

    it('Should return 403 when trying to remove immediate transfer', async () => {
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          transferType: TransferType.Immediate,
          transferId: mockTransferList[1].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyImmediate).toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(response.status).toEqual(403);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Immediate Transfers cannot be modified');
    });

    it('Should remove old schedule transfer', async () => {
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          transferType: TransferType.Scheduled,
          transferId: mockTransferList[1].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).toBeCalled();
      expect(spyRecur).not.toBeCalled();
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toEqual(true);
    });

    it('Should remove old Recurring transfer', async () => {
      (axios.create().delete as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
        .send({
          transferType: TransferType.Recurring,
          transferId: mockTransferList[0].transferId
        })
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

      expect(spyImmediate).not.toBeCalled();
      expect(spySchedule).not.toBeCalled();
      expect(spyRecur).toBeCalled();
      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toEqual(true);
    });
  });

  describe('Transfer Errors (API)', () => {
    let spyImmediate;
    let spySchedule;
    let spyRecur;
    let spyUtil;

    beforeEach(() => {
      spyImmediate = jest.spyOn(ImmediateTransferStrategy.prototype, 'transfer');
      spySchedule = jest.spyOn(ScheduledTransferStrategy.prototype, 'transfer');
      spyRecur = jest.spyOn(RecurringTransferStrategy.prototype, 'transfer');
      spyUtil = jest.spyOn(TransferUtil, 'getTransferType');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      spyImmediate.mockRestore();
      spySchedule.mockRestore();
      spyRecur.mockRestore();
      spyUtil.mockRestore();
    });

    describe('Immediate transfer should return 400 WHEN', () => {
      it('insufficientBalance in message', async () => {
        (axios.create().post as jest.Mock).mockResolvedValueOnce(mockAccessTokenResponse).mockRejectedValue({
          response: { data: 'W-025-BCA_AVLB_AMNT:Overdraft of 1,00 USD; Available 0,00 USD' }
        });

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(TransferErrorCodes.immediateTransfer.INSUFFICIENT_BALANCE.message);
      });

      it('insufficientBalance in erroCode', async () => {
        (axios.create().post as jest.Mock)
          .mockResolvedValueOnce(mockAccessTokenResponse)
          .mockRejectedValue(makeMockError('insufficientBalance'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(TransferErrorCodes.immediateTransfer.INSUFFICIENT_BALANCE.message);
      });

      it('dailyAccessLimitExceed in erroCode', async () => {
        (axios.create().post as jest.Mock)
          .mockResolvedValueOnce(mockAccessTokenResponse)
          .mockRejectedValue(makeMockError('dailyAccessLimitExceed'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(TransferErrorCodes.immediateTransfer.DAILY_ACCESS_LIMIT_EXCEED.message);
      });

      it('weeklyAccessLimitExceed in erroCode', async () => {
        (axios.create().post as jest.Mock)
          .mockResolvedValueOnce(mockAccessTokenResponse)
          .mockRejectedValue(makeMockError('weeklyAccessLimitExceed'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(TransferErrorCodes.immediateTransfer.WEEKLY_ACCESS_LIMIT_EXCEED.message);
      });

      it('monthlyAccessLimitExceed in erroCode', async () => {
        (axios.create().post as jest.Mock)
          .mockResolvedValueOnce(mockAccessTokenResponse)
          .mockRejectedValue(makeMockError('monthlyAccessLimitExceed'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(TransferErrorCodes.immediateTransfer.MONTHLY_ACCESS_LIMIT_EXCEED.message);
      });

      it('dailyCounterLimitExceed in erroCode', async () => {
        (axios.create().post as jest.Mock)
          .mockResolvedValueOnce(mockAccessTokenResponse)
          .mockRejectedValue(makeMockError('dailyCounterLimitExceed'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(TransferErrorCodes.immediateTransfer.DAILY_COUNTER_LIMIT_EXCEED.message);
      });

      it('monthlyCounterLimitExceed in erroCode', async () => {
        (axios.create().post as jest.Mock)
          .mockResolvedValueOnce(mockAccessTokenResponse)
          .mockRejectedValue(makeMockError('monthlyCounterLimitExceed'));

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(400);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(
          TransferErrorCodes.immediateTransfer.MONTHLY_COUNTER_LIMIT_EXCEED.message
        );
      });

      it('unknown error', async () => {
        (axios.create().post as jest.Mock).mockResolvedValueOnce(mockAccessTokenResponse).mockRejectedValue({
          response: {
            data: 'unknow error',
            status: 412
          }
        });

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/bank/internal-transfer`)
          .send(mockImmediate.request)
          .set('Content-Type', 'application/json')
          .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme);

        expect(response.status).toBe(412);
        expect(spyUtil).toBeCalled();
        expect(spyUtil).toHaveReturnedWith(TransferType.Immediate);
        expect(spyImmediate).toBeCalled();
        expect(spySchedule).not.toBeCalled();
        expect(spyRecur).not.toBeCalled();
        expect(axios.create().post).toBeCalledTimes(2);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('unknow error');
      });
    });
  });
});
