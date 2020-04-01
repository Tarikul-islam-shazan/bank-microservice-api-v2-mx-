export enum AppUpdateStatus {
  None = 'None',
  Force = 'Force',
  Soft = 'Soft'
}

export interface IAppVersion {
  version?: string;
  updateUrl?: string;
  platform?: string;
  checkUpgrade?: boolean;
  updateStatus?: string;
}

export enum DevicePlatform {
  IOS = 'ios',
  Android = 'android'
}
