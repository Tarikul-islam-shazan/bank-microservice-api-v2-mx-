import request from 'supertest';

jest.mock('../../../middleware/authMiddleware');
jest.mock('axios');
import axios from 'axios';
jest.mock('@sendgrid/client');
const Client = require('@sendgrid/client');

import { UrbanAirshipService } from '../../urban-airship-service/service';
import { MeedService } from '../../meedservice/service';
import config from '../../../config/config';
import app from '../../../app';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import { mockAccessTokenResponse } from '../../account-service/__tests__/mocks/mock-data';
import {
  mockCustomer,
  UpdateName,
  UpdateAddress,
  UpdateContactNumber,
  UpdateEmail,
  UpdateNickName,
  errWithOtp,
  otpHeaders,
  updateContactHeaders,
  updateCustomerHeaders,
  mockInfo,
  UpdateContactPreference
} from './mock-data';

describe('Customer Service', () => {
  jest.setTimeout(5000);
  const validationError = '"value" does not match any of the allowed types';
  const spyUasLookup = jest.spyOn(UrbanAirshipService.prototype, 'uasNamedUserLookup');
  const spyUasUpdate = jest.spyOn(UrbanAirshipService.prototype, 'uasUpdateEmailChannel');
  const spyFindMemberById = jest.spyOn(MeedService, 'findMemberById');
  const spyFindMemberByEmail = jest.spyOn(MeedService, 'findMemberByEmail');
  const spyUpdateMember = jest.spyOn(MeedService, 'updateMember');

  beforeEach(() => {
    Client.request.mockClear();
    spyUasLookup.mockImplementation(() => ({ channelId: '151' } as any));
    spyUasUpdate.mockImplementation(() => ({} as any));
    spyFindMemberById.mockImplementation(() => ({} as any));
    spyFindMemberByEmail.mockImplementation(() => ({} as any));
    spyUpdateMember.mockImplementation(() => ({ nickname: 'hello' } as any));
    (axios.create().post as jest.Mock)
      .mockResolvedValueOnce(mockAccessTokenResponse)
      .mockRejectedValue('Post Should not be called more than once');
  });

  afterEach(() => {
    (axios.create().post as jest.Mock).mockReset();
    (axios.create().put as jest.Mock).mockReset();
    (axios.create().get as jest.Mock).mockReset();
    spyUasLookup.mockReset();
    spyUasUpdate.mockReset();
    spyFindMemberById.mockReset();
    spyFindMemberByEmail.mockReset();
    spyUpdateMember.mockReset();
  });

  describe('Get Customer Info (GET /customer)', () => {
    it('Should return 400 when memberid missing', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/customer`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy');

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"meedbankingclub-memberid" is required`);
    });

    it('Should return customer info', async () => {
      const mockNickname = {
        nickname: 'jon snow'
      };
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInfo)
        .mockRejectedValue('Get Should not be called more than once');
      spyFindMemberById
        .mockResolvedValueOnce(mockNickname as any)
        .mockRejectedValue('FindMemberById Should not be called more than once');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/customer`)
        .set('Content-Type', 'application/json')
        .set('MeedBankingClub-Bank-Identifier', BankIdentifier.Axiomme)
        .set('MeedBankingClub-username', 'meed.dummy')
        .set('meedbankingclub-memberid', updateCustomerHeaders['meedbankingclub-memberid']);

      expect(response.status).toBe(200);
      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
      expect(spyFindMemberById).toBeCalledWith(updateCustomerHeaders['meedbankingclub-memberid']);

      expect(response.body).toEqual({ ...mockCustomer, nickname: mockNickname.nickname });
    });
  });

  describe('Update Customer Info (PUT /customer) Should return 400 WHEN', () => {
    for (const key of Object.keys(updateCustomerHeaders)) {
      const { [key]: omitted, ...restHeaders } = updateCustomerHeaders as any;
      it(`header ${key} is missing`, async () => {
        (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
        (axios.create().put as jest.Mock).mockRejectedValue('Get Should not be called');

        const response = await request(app)
          .put(`${config.app.baseUrl}v1.0.0/customer`)
          .send({})
          .set(restHeaders);

        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).not.toBeCalled();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`"${key}" is required`);
      });
    }
  });

  describe('Update email (PUT /customer)', () => {
    const updateUrl = `/customerUpdate/${config.api.axxiome.version}/customer/email`;

    it('Should return 400 when email is missing', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock).mockRejectedValue('Get Should not be called');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send({})
        .set(updateCustomerHeaders);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(validationError);
    });

    it('Should return 409 when email exists', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock).mockRejectedValue('Get Should not be called');
      spyFindMemberByEmail
        .mockResolvedValueOnce({})
        .mockRejectedValue('FindMemberByEmail should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateEmail)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(409);

      expect(spyFindMemberByEmail).toBeCalledTimes(1);
      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(axios.create().put as jest.Mock).not.toBeCalled();

      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual('Email Address already exist');
    });

    it('Should return otp on first request', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock)
        .mockRejectedValueOnce(errWithOtp)
        .mockRejectedValue('Put Should not be called more than once');
      spyFindMemberByEmail
        .mockResolvedValueOnce(null)
        .mockRejectedValue('FindMemberByEmail should not be called more than once');
      spyUasLookup.mockResolvedValueOnce({} as any).mockRejectedValue('UasLookup should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateEmail)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(403);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).toBeCalledTimes(1);
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('code');
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toEqual(errWithOtp.response.data.message);
      expect(response.header).toHaveProperty('meedbankingclub-otp-id');
      expect(response.header['meedbankingclub-otp-id']).toEqual(errWithOtp.response.headers['axxd-otp-id']);
    });

    it('Should validate otp and change email', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock)
        .mockResolvedValueOnce({
          status: 200,
          data: {
            Data: {
              Party: {
                EmailAddress: UpdateEmail.email
              }
            }
          }
        })
        .mockRejectedValue('Put Should not be called more than once');
      const spyUpdateEmail = jest.spyOn(MeedService, 'updateEmail').mockResolvedValue({ email: '', priorEmails: [''] });
      spyFindMemberByEmail
        .mockResolvedValueOnce(null)
        .mockRejectedValue('FindMemberByEmail should not be called more than once');
      spyUpdateMember.mockResolvedValueOnce({}).mockRejectedValue('UpdateMember should not be called more than once');
      spyUasLookup
        .mockResolvedValueOnce({
          channelId: '15165'
        } as any)
        .mockRejectedValue('UasLookup should not be called more than once');
      spyUasUpdate.mockResolvedValueOnce({} as any).mockRejectedValue('UasUpdate should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateEmail)
        .set(updateCustomerHeaders)
        .set(otpHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyFindMemberByEmail).toBeCalledWith(UpdateEmail.email);
      expect(spyUpdateEmail).toBeCalledWith(updateCustomerHeaders['meedbankingclub-memberid'], UpdateEmail.email);
      expect(spyUasLookup).toBeCalledWith(updateCustomerHeaders['meedbankingclub-customerid']);
      expect(spyUasUpdate).toBeCalledWith({
        channelID: '15165',
        type: 'email',
        address: UpdateEmail.email
      });
      expect(spyFindMemberById).not.toBeCalled();

      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toEqual(UpdateEmail.email);
      spyUpdateEmail.mockRestore();
    });
  });

  describe('Update nickname (PUT /customer)', () => {
    it('Should return 400 when nickname is missing', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock).mockRejectedValue('Put Should not be called');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send({})
        .set(updateCustomerHeaders);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(validationError);
    });

    it('Should validate otp and update nickname', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock).mockRejectedValue('Put Should not be called');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateNickName)
        .set(updateCustomerHeaders)
        .set(otpHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).not.toBeCalled();

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).toBeCalledWith(updateCustomerHeaders['meedbankingclub-memberid'], UpdateNickName);

      expect(response.body).toHaveProperty('nickname');
      expect(response.body.nickname).toEqual('hello');
    });
  });

  describe('Update contact number (PUT /customer)', () => {
    const updateUrl = `/customerUpdate/${config.api.axxiome.version}/customer/communicationdata`;

    describe('Should return 400 WHEN', () => {
      for (const key of Object.keys(UpdateContactNumber)) {
        const { [key]: omitted, ...restFields } = UpdateContactNumber as any;
        it(`${key} is missing`, async () => {
          (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
          (axios.create().put as jest.Mock).mockRejectedValue('Put Should not be called');

          const response = await request(app)
            .put(`${config.app.baseUrl}v1.0.0/customer`)
            .send(restFields)
            .set(updateCustomerHeaders);

          expect(axios.create().post as jest.Mock).not.toBeCalled();
          expect(axios.create().get as jest.Mock).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('code');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual(validationError);
        });
      }
    });

    it('Should return otp on first request', async () => {
      (axios.create().put as jest.Mock)
        .mockRejectedValueOnce(errWithOtp)
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateContactNumber)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(403);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('code');
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toEqual(errWithOtp.response.data.message);
      expect(response.header).toHaveProperty('meedbankingclub-otp-id');
      expect(response.header['meedbankingclub-otp-id']).toEqual(errWithOtp.response.headers['axxd-otp-id']);
    });

    it('Should validate otp and change contact number', async () => {
      (axios.create().put as jest.Mock)
        .mockResolvedValueOnce({
          status: 200,
          data: {
            Data: {
              Party: {
                Mobile: UpdateContactNumber.mobilePhone,
                Phone: UpdateContactNumber.workPhone
              }
            }
          }
        })
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateContactNumber)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('mobilePhone');
      expect(response.body.mobilePhone).toEqual(UpdateContactNumber.mobilePhone);
    });
  });

  describe('Update address (PUT /customer)', () => {
    const updateUrl = `/customerUpdate/${config.api.axxiome.version}/customer/address`;

    describe('Should return 400 WHEN', () => {
      for (const key of Object.keys(UpdateAddress)) {
        const { [key]: omitted, ...restFields } = UpdateAddress as any;
        it(`${key} is missing`, async () => {
          (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
          (axios.create().put as jest.Mock).mockRejectedValue('Put Should not be called');

          const response = await request(app)
            .put(`${config.app.baseUrl}v1.0.0/customer`)
            .send(restFields)
            .set(updateCustomerHeaders);

          expect(axios.create().post as jest.Mock).not.toBeCalled();
          expect(axios.create().get as jest.Mock).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('code');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual(validationError);
        });
      }
    });

    it('Should return otp on first request', async () => {
      (axios.create().put as jest.Mock)
        .mockRejectedValueOnce(errWithOtp)
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateAddress)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(403);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('code');
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toEqual(errWithOtp.response.data.message);
      expect(response.header).toHaveProperty('meedbankingclub-otp-id');
      expect(response.header['meedbankingclub-otp-id']).toEqual(errWithOtp.response.headers['axxd-otp-id']);
    });

    it('Should validate otp and change address', async () => {
      (axios.create().put as jest.Mock)
        .mockResolvedValueOnce({
          status: 200,
          data: {
            Data: {
              Party: {
                Address: mockInfo.data.Data.Party.Address
              }
            }
          }
        })
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateAddress)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('zipCode');
      expect(response.body).toHaveProperty('city');
      expect(response.body).toHaveProperty('state');
      expect(response.body.address).toEqual(mockInfo.data.Data.Party.Address.AddressLine[0]);
      expect(response.body.zipCode).toEqual(mockInfo.data.Data.Party.Address.PostCode);
      expect(response.body.city).toEqual(mockInfo.data.Data.Party.Address.TownName);
      expect(response.body.state).toEqual(mockInfo.data.Data.Party.Address.CountrySubdivision);
    });
  });

  describe('Update Customer name (PUT /customer)', () => {
    const updateUrl = `/customerUpdate/${config.api.axxiome.version}/customer/masterdata`;

    describe('Should return 400 WHEN', () => {
      for (const key of Object.keys(UpdateName)) {
        const { [key]: omitted, ...restFields } = UpdateName as any;
        // middlename is optional
        if (key === 'middleName') {
          continue;
        }
        it(`${key} is missing`, async () => {
          (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
          (axios.create().put as jest.Mock).mockRejectedValue('Put Should not be called');

          const response = await request(app)
            .put(`${config.app.baseUrl}v1.0.0/customer`)
            .send(restFields)
            .set(updateCustomerHeaders);

          expect(axios.create().post as jest.Mock).not.toBeCalled();
          expect(axios.create().get as jest.Mock).not.toBeCalled();
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('code');
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toEqual(validationError);
        });
      }
    });

    it('Should return otp on first request', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock)
        .mockRejectedValueOnce(errWithOtp)
        .mockRejectedValue('Get Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateName)
        .set(updateCustomerHeaders);

      expect(response.status).toBe(403);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('code');
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toEqual(errWithOtp.response.data.message);
      expect(response.header).toHaveProperty('meedbankingclub-otp-id');
      expect(response.header['meedbankingclub-otp-id']).toEqual(errWithOtp.response.headers['axxd-otp-id']);
    });

    it('Should validate otp and update name', async () => {
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
      (axios.create().put as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            Data: {
              Party: {
                Salutation: UpdateName.salutation,
                FirstName: UpdateName.firstName,
                MiddleName: UpdateName.middleName,
                LastName: UpdateName.lastName,
                DateOfBirth: UpdateName.dateOfBirth
              }
            }
          }
        })
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer`)
        .send(UpdateName)
        .set(updateCustomerHeaders)
        .set(otpHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(Client.request).toBeCalledTimes(1);
      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('salutation');
      expect(response.body.salutation).toEqual(UpdateName.salutation);
    });
  });

  describe('Update Contact Preference (PUT /customer/contact-preference)', () => {
    const updateUrl = `/customerUpdate/${config.api.axxiome.version}/customer/contactpreferences`;

    for (const key of Object.keys(updateContactHeaders)) {
      const { [key]: omitted, ...restHeaders } = updateContactHeaders as any;
      it(`Should return 400 when header ${key} is missing`, async () => {
        (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
        (axios.create().put as jest.Mock).mockRejectedValue('Get Should not be called');

        const response = await request(app)
          .put(`${config.app.baseUrl}v1.0.0/customer/contact-preference`)
          .send({})
          .set(restHeaders);

        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).not.toBeCalled();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`"${key}" is required`);
      });
    }

    for (const key of Object.keys(UpdateContactPreference)) {
      const { [key]: omitted, ...resInfo } = UpdateContactPreference as any;
      it(`Should return 400 when ${key} is missing in request body`, async () => {
        (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
        (axios.create().put as jest.Mock).mockRejectedValue('Get Should not be called');

        const response = await request(app)
          .put(`${config.app.baseUrl}v1.0.0/customer/contact-preference`)
          .send(resInfo)
          .set(updateContactHeaders);

        expect(response.status).toBe(400);

        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).not.toBeCalled();

        expect(spyUasLookup).not.toBeCalled();
        expect(spyUasUpdate).not.toBeCalled();
        expect(spyFindMemberById).not.toBeCalled();
        expect(spyFindMemberByEmail).not.toBeCalled();
        expect(spyUpdateMember).not.toBeCalled();

        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`"${key}" is required`);
      });
    }

    it('Should return otp on first request', async () => {
      (axios.create().put as jest.Mock)
        .mockRejectedValueOnce(errWithOtp)
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer/contact-preference`)
        .send(UpdateContactPreference)
        .set(updateContactHeaders);

      expect(response.status).toBe(403);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('code');
      expect(response.body.data).toHaveProperty('message');
      expect(response.body.data.message).toEqual(errWithOtp.response.data.message);
      expect(response.header).toHaveProperty('meedbankingclub-otp-id');
      expect(response.header['meedbankingclub-otp-id']).toEqual(errWithOtp.response.headers['axxd-otp-id']);
    });

    it('Should validate otp and update contact preference', async () => {
      (axios.create().put as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            Data: {
              Party: {
                CommunicationPreference: {
                  AdvertisingAllowed: UpdateContactPreference.status,
                  CommunicationType: UpdateContactPreference.type
                }
              }
            }
          }
        })
        .mockRejectedValue('Put Should not be called more than once');

      const response = await request(app)
        .put(`${config.app.baseUrl}v1.0.0/customer/contact-preference`)
        .send(UpdateContactPreference)
        .set(updateContactHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).toBeCalledWith(updateUrl, expect.anything(), expect.anything());

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toHaveProperty('status');
      expect(response.body).toEqual(UpdateContactPreference);
    });
  });

  describe('Get Contact Preference (GET /customer/contact-preference)', () => {
    it('Should return contact preference', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockInfo)
        .mockRejectedValue('Get Should not be called more than once');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/customer/contact-preference`)
        .set(updateContactHeaders);

      expect(response.status).toBe(200);

      expect(axios.create().post as jest.Mock).toBeCalledTimes(1);
      expect(axios.create().put as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledWith(
        `/customerUpdate/${config.api.axxiome.version}/customer`,
        expect.anything()
      );

      expect(spyUasLookup).not.toBeCalled();
      expect(spyUasUpdate).not.toBeCalled();
      expect(spyFindMemberById).not.toBeCalled();
      expect(spyFindMemberByEmail).not.toBeCalled();
      expect(spyUpdateMember).not.toBeCalled();

      expect(response.body).toBeArrayOfSize(mockInfo.data.Data.Party.CommunicationPreference.length);
      expect(response.body[1].type).toEqual(
        mockInfo.data.Data.Party.CommunicationPreference[1].CommunicationType.toLowerCase()
      );
    });
  });
});
