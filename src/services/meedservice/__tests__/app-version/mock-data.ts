import { AppUpdateStatus } from '../../../models/meedservice/app-version';

export const mockAppVersion = {
  _id: '5de5f6080fba0d4af31f6e8c',
  version: '2.0.0',
  updateUrl: 'https://meed.com',
  platform: 'ios',
  checkUpgrade: false,
  createdDate: '2019-12-03T05:43:36.446Z',
  updatedDate: '2019-12-03T05:43:36.446Z'
};

export const mockCreate = {
  version: '2.0.0',
  updateUrl: 'https://meed.com',
  platform: 'ios'
};

export const updateCases = [
  {
    current: '0.0.1',
    new: '0.0.1',
    update: AppUpdateStatus.None
  },
  {
    current: '1.2.1',
    new: '1.2.1',
    update: AppUpdateStatus.None
  },
  {
    current: '2.0.0',
    new: '1.0.0',
    update: AppUpdateStatus.None
  },
  {
    current: '0.0.1',
    new: '1.0.0',
    update: AppUpdateStatus.Force
  },
  {
    current: '2.3.6',
    new: '3.8.4',
    update: AppUpdateStatus.Force
  },
  {
    current: '0.0.1',
    new: '0.1.0',
    update: AppUpdateStatus.Soft
  },
  {
    current: '0.0.1',
    new: '0.0.3',
    update: AppUpdateStatus.Soft
  },
  {
    current: '1.2.6',
    new: '1.3.2',
    update: AppUpdateStatus.Soft
  },
  {
    current: '1.2.6',
    new: '1.2.8',
    update: AppUpdateStatus.Soft
  }
];
