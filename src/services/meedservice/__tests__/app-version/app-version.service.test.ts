import request from 'supertest';
import querystring from 'querystring';
jest.mock('../../../../middleware/authMiddleware.ts');

import config from '../../../../config/config';
import app from '../../../../app';
import { AppVersionRepository } from '../..//repository/app-version-repository';
import { AppUpdateStatus } from '../../../models/meedservice/app-version';
import { mockAppVersion, mockCreate, updateCases } from './mock-data';

describe('App Version Service', () => {
  jest.setTimeout(5000);

  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('Create App Versiob', () => {
    let spyCreate;

    beforeEach(() => {
      spyCreate = jest.spyOn(AppVersionRepository.prototype, 'create');
    });

    afterEach(() => {
      spyCreate.mockRestore();
    });

    for (const key of Object.keys(mockCreate)) {
      const { [key]: omitted, ...restFields } = mockCreate as any;
      it(`Should return 400 when ${key} is missing`, async () => {
        spyCreate.mockRejectedValue('Create Should not be called');

        const response = await request(app)
          .post(`${config.app.baseUrl}v1.0.0/app-version`)
          .send(restFields);

        expect(response.status).toBe(400);
        expect(spyCreate).not.toBeCalled();
        expect(response.body).toHaveProperty('code');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual(`"${key}" is required`);
      });
    }

    it(`Should return 200 and create app version`, async () => {
      spyCreate.mockResolvedValueOnce(mockAppVersion).mockRejectedValue('Create Should not be called more than once');

      const response = await request(app)
        .post(`${config.app.baseUrl}v1.0.0/app-version`)
        .send(mockCreate);

      expect(response.status).toBe(200);
      expect(spyCreate).toBeCalledTimes(1);
      expect(response.body).toHaveProperty('checkUpgrade');
      expect(response.body).toEqual(mockAppVersion);
    });
  });

  describe('Get App Version list', () => {
    let spyFind;

    beforeEach(() => {
      spyFind = jest.spyOn(AppVersionRepository.prototype, 'find');
    });

    afterEach(() => {
      spyFind.mockRestore();
    });

    it(`Should return 200 and app version list`, async () => {
      spyFind.mockResolvedValueOnce([mockAppVersion]).mockRejectedValue('Find Should not be called more than once');

      const response = await request(app).get(`${config.app.baseUrl}v1.0.0/app-version`);

      expect(response.status).toBe(200);
      expect(spyFind).toBeCalledTimes(1);
      expect(response.body).toBeArrayOfSize(1);
      expect(response.body[0]).toEqual(mockAppVersion);
    });
  });

  describe('Update App Version', () => {
    let spyUpdate;

    beforeEach(() => {
      spyUpdate = jest.spyOn(AppVersionRepository.prototype, 'findByIdAndUpdate');
    });

    afterEach(() => {
      spyUpdate.mockRestore();
    });

    it(`Should return 400 when try to update platform`, async () => {
      spyUpdate.mockRejectedValue('Update Should not be called');

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/app-version/${mockAppVersion._id}`)
        .send(mockCreate);

      expect(response.status).toBe(400);
      expect(spyUpdate).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"platform" is not allowed`);
    });

    it(`Should return 200 and update app version`, async () => {
      spyUpdate.mockResolvedValueOnce(mockAppVersion).mockRejectedValue('Update Should not be called more than once');
      const { platform, ...restFields } = mockCreate as any;

      const response = await request(app)
        .patch(`${config.app.baseUrl}v1.0.0/app-version/${mockAppVersion._id}`)
        .send(restFields);

      expect(response.status).toBe(200);
      expect(spyUpdate).toBeCalledWith(mockAppVersion._id, restFields);
      expect(response.body).toEqual(mockAppVersion);
    });
  });

  describe('Delete App Version', () => {
    let spyDelete;

    beforeEach(() => {
      spyDelete = jest.spyOn(AppVersionRepository.prototype, 'delete');
    });

    afterEach(() => {
      spyDelete.mockRestore();
    });

    it(`Should return 204 and delete app version`, async () => {
      spyDelete.mockResolvedValueOnce({}).mockRejectedValue('Delete Should not be called more than once');

      const response = await request(app).delete(`${config.app.baseUrl}v1.0.0/app-version/${mockAppVersion._id}`);

      expect(response.status).toBe(204);
      expect(spyDelete).toBeCalledWith(mockAppVersion._id);
      expect(response.body).toBeEmpty();
    });
  });

  describe('Check App Upgrade', () => {
    const upgradeQuery = {
      platform: mockAppVersion.platform,
      currentVersion: '1.0.0'
    };
    let spyFindOne;

    beforeEach(() => {
      spyFindOne = jest.spyOn(AppVersionRepository.prototype, 'findOne');
    });

    afterEach(() => {
      spyFindOne.mockRestore();
    });

    it(`Should return 400 when platform query missing`, async () => {
      spyFindOne.mockRejectedValue('Findone Should not be called');
      const { currentVersion } = upgradeQuery;

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/app-version/upgrade?${querystring.encode({ currentVersion })}`
      );

      expect(response.status).toBe(400);
      expect(spyFindOne).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"platform" is required`);
    });

    it(`Should return 400 when currentVersion query missing`, async () => {
      spyFindOne.mockRejectedValue('Findone Should not be called');
      const { platform } = upgradeQuery;

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/app-version/upgrade?${querystring.encode({ platform })}`
      );

      expect(response.status).toBe(400);
      expect(spyFindOne).not.toBeCalled();
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toEqual(`"currentVersion" is required`);
    });

    it(`Should return None when check upgrade false`, async () => {
      spyFindOne
        .mockResolvedValueOnce({ version: '1.0.0', checkUpgrade: false, updateUrl: mockAppVersion.updateUrl })
        .mockRejectedValue('Findone Should not be called more than once');
      upgradeQuery.currentVersion = '0.0.1';

      const response = await request(app).get(
        `${config.app.baseUrl}v1.0.0/app-version/upgrade?${querystring.encode(upgradeQuery)}`
      );

      expect(response.status).toBe(200);
      expect(spyFindOne).toBeCalledWith({ platform: upgradeQuery.platform }, { updatedDate: -1 });
      expect(response.body).toEqual({
        updateStatus: AppUpdateStatus.None,
        updateUrl: mockAppVersion.updateUrl
      });
    });

    for (const updateCase of updateCases) {
      it(`Should return ${updateCase.update} update when current ${updateCase.current} & update ${updateCase.new}`, async () => {
        spyFindOne
          .mockResolvedValueOnce({ version: updateCase.new, checkUpgrade: true, updateUrl: mockAppVersion.updateUrl })
          .mockRejectedValue('Findone Should not be called more than once');
        upgradeQuery.currentVersion = updateCase.current;

        const response = await request(app).get(
          `${config.app.baseUrl}v1.0.0/app-version/upgrade?${querystring.encode(upgradeQuery)}`
        );

        expect(response.status).toBe(200);
        expect(spyFindOne).toBeCalledWith({ platform: upgradeQuery.platform }, { updatedDate: -1 });
        expect(response.body).toEqual({
          updateStatus: updateCase.update,
          updateUrl: mockAppVersion.updateUrl
        });
      });
    }
  });
});
