import request from 'supertest';
import querystring from 'querystring';

jest.mock('../../../middleware/authMiddleware');
jest.mock('axios');
import axios from 'axios';

import config from '../../../config/config';
import app from '../../../app';
import { mockAccessTokenResponse } from '../../account-service/__tests__/mocks/mock-data';
import { AxCustomerService } from '../../customer-service/ax-service';
import {
  mockCategory,
  mockDetails,
  mockHeaders,
  mockSession,
  unmappedCategories,
  mockCustomer,
  unMappedOffer,
  mockSearchQuery
} from './mocks/mock-data';

describe('Affinity Service', () => {
  jest.setTimeout(5000);

  describe('Should return 400 WHEN', () => {
    beforeEach(() => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post Should not be called');
      (axios.create().get as jest.Mock).mockRejectedValue('Get Should not be called');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
    });

    for (const key of Object.keys(mockHeaders)) {
      const { [key]: omitted, ...restHeaders } = mockHeaders as any;
      it(`/offers/categories has no ${key} in header`, async () => {
        const req = request(app)
          .get(`${config.app.baseUrl}v1.0.0/offers/categories`)
          .set('Content-Type', 'application/json');

        Object.keys(restHeaders).forEach(header => {
          req.set(header, restHeaders[header]);
        });

        const response = await req;

        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).not.toBeCalled();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`\"${key}\" is required`);
      });
    }

    for (const url of ['offers', 'offers/featured', `offers/${mockDetails.id}`]) {
      it(`${url} has no customerid in header`, async () => {
        const response = await request(app)
          .get(`${config.app.baseUrl}v1.0.0/${url}`)
          .set('Content-Type', 'application/json');

        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).not.toBeCalled();
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`\"meedbankingclub-customerid\" is required`);
      });
    }

    it('/offers/:id/activate has no customerid in header', async () => {
      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/offers/${mockDetails.id}/activate`)
        .set('Content-Type', 'application/json');

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).not.toBeCalled();
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`\"meedbankingclub-customerid\" is required`);
    });
  });

  describe('Get Category List', () => {
    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
    });

    it('Should return 200 when already registered', async () => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post Should not be called');
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce({ data: unmappedCategories })
        .mockRejectedValue('Get Should not be called more than 2');

      const req = request(app)
        .get(`${config.app.baseUrl}v1.0.0/offers/categories`)
        .set('Content-Type', 'application/json');
      Object.keys(mockHeaders).forEach(header => {
        req.set(header, mockHeaders[header]);
      });
      const response = await req;

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.body).toBeArrayOfSize(mockCategory.length);
      expect(response.body).toEqual(mockCategory);
    });

    it('Should register for the first time and return category list', async () => {
      (axios.create().get as jest.Mock)
        // let fail the first getsessionid call
        .mockResolvedValueOnce({ data: { status: 'fail', error: '' } })
        // lets successfully registered
        .mockResolvedValueOnce({ data: { status: 'success' }, sid: 'ada' })
        // return sessionid after registration
        .mockResolvedValueOnce(mockSession)
        // return category
        .mockResolvedValueOnce({ data: unmappedCategories })
        .mockRejectedValue('Get Should not be called more than 2');

      const spy = jest.spyOn(AxCustomerService.prototype, 'customerInfo');
      spy.mockResolvedValue(mockCustomer as any);

      const req = request(app)
        .get(`${config.app.baseUrl}v1.0.0/offers/categories`)
        .set('Content-Type', 'application/json');
      Object.keys(mockHeaders).forEach(header => {
        req.set(header, mockHeaders[header]);
      });
      const response = await req;

      expect(spy).toBeCalledWith(mockHeaders['meedbankingclub-memberid']);
      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(4);
      expect(response.status).toBe(200);
      expect(response.body).toBeArrayOfSize(mockCategory.length);
      expect(response.body).toEqual(mockCategory);

      spy.mockRestore();
    });
  });

  describe('Offers APIs OK', () => {
    beforeEach(() => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post Should not be called');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
    });

    it('/offers Should return offer list without query', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce({ data: { status: 'success', results: unMappedOffer } })
        .mockRejectedValue('Get Should not be called more than twice');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/offers`)
        .set('Content-Type', 'application/json')
        .set('meedbankingclub-customerid', mockHeaders['meedbankingclub-customerid']);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.body).toBeArrayOfSize(1);
      const { stores, image, ...rest } = mockDetails;
      expect(response.body).toEqual([rest]);
    });

    it('/offers Should return offer list with search query', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce({ data: { status: 'success', results: unMappedOffer } })
        .mockRejectedValue('Get Should not be called more than twice');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/offers?${querystring.encode(mockSearchQuery)}`)
        .set('Content-Type', 'application/json')
        .set('meedbankingclub-customerid', mockHeaders['meedbankingclub-customerid']);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.body).toBeArrayOfSize(1);
      const { stores, image, ...rest } = mockDetails;
      expect(response.body).toEqual([rest]);
    });

    it('/offers/featured Should return featured offer list', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce({ data: { status: 'success', results: unMappedOffer } })
        .mockRejectedValue('Get Should not be called more than twice');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/offers/featured`)
        .set('Content-Type', 'application/json')
        .set('meedbankingclub-customerid', mockHeaders['meedbankingclub-customerid']);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.body).toBeArrayOfSize(1);
      const { stores, image, ...rest } = mockDetails;
      expect(response.body).toEqual([rest]);
    });

    it('/offers/:id Should return offer details', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce({ data: { status: 'success', results: unMappedOffer } })
        .mockRejectedValue('Get Should not be called more than twice');

      const response = await request(app)
        .get(`${config.app.baseUrl}v1.0.0/offers/${mockDetails.id}`)
        .set('Content-Type', 'application/json')
        .set('meedbankingclub-customerid', mockHeaders['meedbankingclub-customerid']);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDetails);
    });

    it('/offers/:id/activate Should activate offer', async () => {
      (axios.create().get as jest.Mock)
        .mockResolvedValueOnce(mockSession)
        .mockResolvedValueOnce({ data: { status: 'success' } })
        .mockRejectedValue('Get Should not be called more than twice');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/offers/${mockDetails.id}/activate`)
        .set('Content-Type', 'application/json')
        .set('meedbankingclub-customerid', mockHeaders['meedbankingclub-customerid']);

      expect(axios.create().post as jest.Mock).not.toBeCalled();
      expect(axios.create().get as jest.Mock).toBeCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: { status: 'success' } });
    });
  });

  describe('Offers APIs Error', () => {
    beforeEach(() => {
      (axios.create().post as jest.Mock).mockRejectedValue('Post Should not be called');
    });

    afterEach(() => {
      (axios.create().post as jest.Mock).mockReset();
      (axios.create().get as jest.Mock).mockReset();
    });

    for (const url of ['offers', 'offers/featured', `offers/${mockDetails.id}`]) {
      it(`/${url} Should return 500 when get sessionid failed`, async () => {
        (axios.create().get as jest.Mock)
          .mockResolvedValueOnce({ data: { status: 'fail', error: 'MockError' } })
          .mockRejectedValue('Get Should not be called more than twice');

        const response = await request(app)
          .get(`${config.app.baseUrl}v1.0.0/${url}`)
          .set('Content-Type', 'application/json')
          .set('meedbankingclub-customerid', mockHeaders['meedbankingclub-customerid']);

        expect(axios.create().post as jest.Mock).not.toBeCalled();
        expect(axios.create().get as jest.Mock).toBeCalledTimes(1);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('MockError');
      });
    }
  });
});
