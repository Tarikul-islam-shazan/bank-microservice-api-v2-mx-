import { BankAtmService } from '../service';
import config from '../../../config/config';
import { Database } from '../../../utils/database';
import { IBankAtm } from '../../models/bank-atms/interface';
import { BankAtmModel } from '../models';
import mongoose from 'mongoose';
import {
  AtmMock,
  AtmByAddressQuery,
  AtmByLatlngQuery,
  BankMock,
  mockGeocodeData,
  mockMapError,
  mockMapNoResult,
  mockAtmResponse
} from './mocks/mock-data';

import app from '../../../app';
import request from 'supertest';
import querystring from 'querystring';
import { BankModel } from '../../meedservice/models/bank';

jest.mock('../../../middleware/authMiddleware');
jest.mock('../../../utils/google-map');
import { GMapClient } from '../../../utils/google-map';

beforeEach(() => {
  (GMapClient.geocode({}).asPromise as jest.Mock).mockResolvedValueOnce(mockGeocodeData);
});

afterEach(() => {
  (GMapClient.geocode({}).asPromise as jest.Mock).mockReset();
});

// Use mock database
describe('Bank Atm Service - Mock Database', () => {
  jest.setTimeout(5000);
  let spyFind, spyFindNearby;

  beforeEach(() => {
    spyFind = jest.spyOn(BankAtmService, 'find');
    spyFindNearby = jest.spyOn(BankAtmService, 'findNearby');
  });

  afterEach(() => {
    spyFind.mockRestore();
    spyFindNearby.mockRestore();
  });

  describe('Find bank atm list', () => {
    it('should return one element in mock database', async () => {
      spyFind.mockResolvedValueOnce([mockAtmResponse]);
      const atms: IBankAtm[] = await BankAtmService.find({ bank: AtmMock.bank }, null, null);
      expect(atms.length).toEqual(1);
      expect(atms[0].city).toEqual(AtmMock.city);
    });
  });

  describe('Find neaby atm', () => {
    it('should work', async () => {
      const spy = spyFindNearby.mockResolvedValueOnce([mockAtmResponse]);
      const atms: IBankAtm[] = await BankAtmService.findNearby(
        AtmByAddressQuery as IBankAtm,
        AtmByAddressQuery.unitOfMeasure,
        AtmByAddressQuery.address
      );
      expect(atms.length).toEqual(1);
    });
  });
});

// Use Real database
describe('Bank Atm Service - Real Database', () => {
  jest.setTimeout(5000);
  let db;

  beforeAll(async () => {
    db = await Database.connect(config.database.url);
    await BankAtmModel.deleteMany({}).exec();
    await BankModel.deleteMany({}).exec();
    await new BankModel({
      _id: mongoose.Types.ObjectId(AtmMock.bank),
      ...BankMock
    }).save();
    await new BankAtmModel(AtmMock).save();
  });

  afterAll(async () => {
    await BankModel.deleteMany({}).exec();
    await BankAtmModel.deleteMany({}).exec();
    jest.restoreAllMocks();
    db.connection.close();
  });

  describe('Find bank atm list', () => {
    it('should return array on save real database', async () => {
      const atms: IBankAtm[] = await BankAtmService.find({ bank: mongoose.Types.ObjectId(AtmMock.bank) }, null, null);
      expect(atms.length).toEqual(1);
      expect(atms[0].locationType).toEqual('Atm');
      expect(atms[0].location.longitude).toEqual(mockAtmResponse.location.longitude);
    });
  });

  describe('Find Nearby atms (API)', () => {
    describe('No bank exists', () => {
      beforeAll(async () => {
        await BankModel.deleteMany({}).exec();
      });

      afterAll(async () => {
        await new BankModel({
          _id: mongoose.Types.ObjectId(AtmMock.bank),
          ...BankMock
        }).save();
      });

      it('should return 404 when no bank found', async () => {
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(AtmByAddressQuery)}`
        );
        expect(response.status).toBe(404);
      });
    });

    describe('Test queries', () => {
      it('should return 400 on missing query', async () => {
        const response = await request(app).get(`${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}`);
        expect(response.status).toBe(400);
      });
      it('should return 400 on missing distance', async () => {
        const { distance, ...apiQuery } = AtmByAddressQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(400);
      });
      it('should return 200 on missing optional locationType', async () => {
        const { locationType, ...apiQuery } = AtmByAddressQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(200);
      });
      it('should return 200 on missing optional unitOfMeasure', async () => {
        const { unitOfMeasure, ...apiQuery } = AtmByAddressQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(200);
      });
      it('should return 400 on missing address', async () => {
        const { address, ...apiQuery } = AtmByAddressQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(400);
      });
      it('should return 400 on missing address and latitude', async () => {
        const { latitude, ...apiQuery } = AtmByLatlngQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(400);
      });
      it('should return 400 on missing address and longitude', async () => {
        const { longitude, ...apiQuery } = AtmByLatlngQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(400);
      });
      it('should return 400 on missing address, latitude and longitude', async () => {
        const { longitude, latitude, ...apiQuery } = AtmByLatlngQuery;
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(apiQuery as any)}`
        );
        expect(response.status).toBe(400);
      });
    });

    describe('Find by address', () => {
      it('should return 404 when map give no result', async () => {
        (GMapClient.geocode({}).asPromise as jest.Mock).mockReset();
        (GMapClient.geocode({}).asPromise as jest.Mock).mockResolvedValueOnce(mockMapNoResult);

        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(AtmByAddressQuery)}`
        );
        expect(response.status).toBe(404);
      });

      it('should return error when gmap got error', async () => {
        (GMapClient.geocode({}).asPromise as jest.Mock).mockReset();
        (GMapClient.geocode({}).asPromise as jest.Mock).mockRejectedValueOnce(mockMapError);

        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(AtmByAddressQuery)}`
        );
        expect(response.status).toBe(429);
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(mockMapError.json.error_message);
      });

      it('should return 200 on valid query', async () => {
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(AtmByAddressQuery)}`
        );
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].city).toEqual(AtmMock.city);
        expect(response.body[0].streetAddress).toEqual(AtmMock.streetAddress);
        expect(response.body[0].locationName).toEqual(AtmMock.locationName);
      });
    });

    describe('Find by geocode', () => {
      it('should return 200 on valid query', async () => {
        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/bank/atm/${AtmMock.bank}?${querystring.encode(AtmByLatlngQuery)}`
        );
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].city).toEqual(AtmMock.city);
        expect(response.body[0].streetAddress).toEqual(AtmMock.streetAddress);
        expect(response.body[0].locationName).toEqual(AtmMock.locationName);
      });
    });
  });
});
