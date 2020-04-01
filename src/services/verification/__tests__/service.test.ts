import request from 'supertest';
import moment from 'moment';
jest.mock('axios');
import axios from 'axios';
jest.mock('@sendgrid/client');
const Client = require('@sendgrid/client');

import config from '../../../config/config';
import app from '../../../app';
import { EmailVerificationRepository } from '../repository/email-verification-repository';
import { EmailVerificationErrorCodes } from '../errors';
import { VerificationService } from '../service';

describe('Verification Service', () => {
  jest.setTimeout(5000);
  const email = 'meed0071@yopmail.com';

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('Send Email Verification Code', () => {
    const { createVerificationCode } = EmailVerificationErrorCodes;
    let spyCreate;

    beforeEach(() => {
      Client.request.mockClear();
      spyCreate = jest.spyOn(EmailVerificationRepository.prototype, 'create');
    });

    afterEach(() => {
      (axios.create().get as jest.Mock).mockReset();
      spyCreate.mockRestore();
    });

    it('Should return 400 when email is missing', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get should not be called');
      spyCreate.mockRejectedValue('Create should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/verification`)
        .send({});

      expect(response.status).toBe(400);
      expect(spyCreate).not.toBeCalled();
      expect(Client.request).not.toBeCalled();
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"email" is required`);
    });

    it(`Should return ${createVerificationCode.INVALID_EMAIL_ADDRESS.httpCode} when email address is invalid`, async () => {
      (axios.create().get as jest.Mock)
        // brite verify
        .mockResolvedValueOnce({
          data: {
            status: 'accept_all',
            disposable: true
          }
        })
        .mockRejectedValue('Post should not be called');
      spyCreate.mockRejectedValue('Create should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email });

      expect(response.status).toBe(EmailVerificationErrorCodes.createVerificationCode.INVALID_EMAIL_ADDRESS.httpCode);
      expect(spyCreate).not.toBeCalled();
      expect(Client.request).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(
        EmailVerificationErrorCodes.createVerificationCode.INVALID_EMAIL_ADDRESS.message
      );
    });

    it(`Should return 500 when create code in database error`, async () => {
      (axios.create().get as jest.Mock)
        // brite verify
        .mockResolvedValueOnce({
          data: {
            status: 'accept_all',
            disposable: false
          }
        })
        .mockRejectedValue('Post should not be called');
      spyCreate.mockRejectedValue('Create should not be called');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email });

      expect(response.status).toBe(500);
      expect(spyCreate).toBeCalledTimes(1);
      expect(Client.request).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
    });

    it(`Should return 500 when sendgrid error`, async () => {
      (axios.create().get as jest.Mock)
        // brite verify
        .mockResolvedValueOnce({
          data: {
            status: 'accept_all',
            disposable: false
          }
        })
        .mockRejectedValue('Post should not be called');
      spyCreate.mockResolvedValueOnce({}).mockRejectedValue('Create should not be called more than once');
      Client.request.mockRejectedValue({
        response: {
          status: 412,
          error: 'Sendgrid error'
        }
      });

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email });

      expect(response.status).toBe(500);
      expect(spyCreate).toBeCalledTimes(1);
      expect(Client.request).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
    });

    it(`Should return 200 when send verification code`, async () => {
      (axios.create().get as jest.Mock)
        // brite verify
        .mockResolvedValueOnce({
          data: {
            status: 'accept_all',
            disposable: false
          }
        })
        .mockRejectedValue('Post should not be called');
      spyCreate.mockResolvedValueOnce({}).mockRejectedValue('Create should not be called more than once');
      Client.request.mockResolvedValue({});

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email });

      expect(response.status).toBe(204);
      expect(spyCreate).toBeCalledTimes(1);
      expect(Client.request).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
    });
  });

  describe('Verify Email Verification Code', () => {
    const { verifyEmailCode } = EmailVerificationErrorCodes;
    const mockData = {
      _id: '5df362c2f42c00772d59351e',
      validated: false,
      email,
      verificationCode: '316373',
      numberOfTries: 1,
      createdDate: moment()
        .utc()
        .add(1, 'year'),
      updatedDate: '2019-12-13T10:08:29.422Z'
    };

    let spyFind;
    let spyUpdate;

    beforeAll(() => {
      (axios.create().get as jest.Mock).mockRejectedValue('Axios should not be called');
    });

    beforeEach(() => {
      spyFind = jest.spyOn(EmailVerificationRepository.prototype, 'findLastInvitationCode');
      spyUpdate = jest.spyOn(EmailVerificationRepository.prototype, 'findByIdAndUpdate');
    });

    afterEach(() => {
      spyFind.mockRestore();
      spyUpdate.mockRestore();
    });

    it('Should return 400 when email is missing', async () => {
      spyFind.mockRejectedValue('Find should not be called');
      spyUpdate.mockRejectedValue('Update should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ verificationCode: mockData.verificationCode });

      expect(response.status).toBe(400);
      expect(spyFind).not.toBeCalled();
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"email" is required`);
    });

    it('Should return 400 when verificationCode is missing', async () => {
      spyFind.mockRejectedValue('Find should not be called');
      spyUpdate.mockRejectedValue('Update should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email });

      expect(response.status).toBe(400);
      expect(spyFind).not.toBeCalled();
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"verificationCode" is required`);
    });

    it(`Should return ${verifyEmailCode.NO_CODE_GENERATED_FOR_THIS_EMAIL.httpCode} when no code found`, async () => {
      spyFind.mockResolvedValueOnce(null).mockRejectedValue('Find should not be called more than once');
      spyUpdate.mockRejectedValue('Update should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email, verificationCode: mockData.verificationCode });

      expect(response.status).toBe(verifyEmailCode.NO_CODE_GENERATED_FOR_THIS_EMAIL.httpCode);
      expect(spyFind).toBeCalledTimes(1);
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(verifyEmailCode.NO_CODE_GENERATED_FOR_THIS_EMAIL.message);
    });

    it(`Should return ${verifyEmailCode.NEW_VERIFICATION_CODE_IS_REQUIRED.httpCode} when max attempt reached`, async () => {
      spyFind
        .mockResolvedValueOnce({
          ...mockData,
          numberOfTries: VerificationService.MAX_WRONG_ATTEMPT_LIMIT
        })
        .mockRejectedValue('Find should not be called more than once');
      spyUpdate.mockRejectedValue('Update should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email, verificationCode: mockData.verificationCode });

      expect(response.status).toBe(verifyEmailCode.NEW_VERIFICATION_CODE_IS_REQUIRED.httpCode);
      expect(spyFind).toBeCalledTimes(1);
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(verifyEmailCode.NEW_VERIFICATION_CODE_IS_REQUIRED.message);
    });

    it(`Should return ${verifyEmailCode.ACTIVATION_CODE_EXPIRED.httpCode} when code expired`, async () => {
      spyFind
        .mockResolvedValueOnce({
          ...mockData,
          createdDate: moment()
            .utc()
            .subtract(1, 'year')
        })
        .mockRejectedValue('Find should not be called more than once');
      spyUpdate.mockRejectedValue('Update should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email, verificationCode: mockData.verificationCode });

      expect(response.status).toBe(verifyEmailCode.ACTIVATION_CODE_EXPIRED.httpCode);
      expect(spyFind).toBeCalledTimes(1);
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(verifyEmailCode.ACTIVATION_CODE_EXPIRED.message);
    });

    it(`Should return ${verifyEmailCode.ALREADY_USED_VERIFICATION_CODE.httpCode} when code already used`, async () => {
      spyFind
        .mockResolvedValueOnce({ ...mockData, validated: true })
        .mockRejectedValue('Find should not be called more than once');
      spyUpdate.mockRejectedValue('Update should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email, verificationCode: mockData.verificationCode });

      expect(response.status).toBe(verifyEmailCode.ALREADY_USED_VERIFICATION_CODE.httpCode);
      expect(spyFind).toBeCalledTimes(1);
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(verifyEmailCode.ALREADY_USED_VERIFICATION_CODE.message);
    });

    it(`Should return 200 and validate false when code missmatch`, async () => {
      spyFind.mockResolvedValueOnce(mockData).mockRejectedValue('Find should not be called more than once');
      spyUpdate.mockResolvedValueOnce({}).mockRejectedValue('Update should not be called more than once');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email, verificationCode: '5498451' });

      expect(response.status).toBe(200);
      expect(spyFind).toBeCalledTimes(1);
      expect(spyUpdate).toBeCalledTimes(1);
      expect(response.body).toHaveProperty('isValid');
      expect(response.body.isValid).toBeFalse();
    });

    it(`Should return 200 and validate true`, async () => {
      spyFind.mockResolvedValueOnce(mockData).mockRejectedValue('Find should not be called more than once');
      spyUpdate.mockResolvedValueOnce({}).mockRejectedValue('Update should not be called more than once');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/verification`)
        .send({ email, verificationCode: mockData.verificationCode });

      expect(response.status).toBe(200);
      expect(spyFind).toBeCalledTimes(1);
      expect(spyUpdate).toBeCalledTimes(1);
      expect(response.body).toHaveProperty('isValid');
      expect(response.body.isValid).toBeTrue();
    });
  });
});
