import semverDiff from 'semver-diff';

import { AppVersionRepository } from '../repository/app-version-repository';
import { IAppVersion, AppUpdateStatus } from '../../models/meedservice/app-version';
import { HTTPError } from '../../../utils/httpErrors';

export class AppVersionService {
  private static appVersionRepository = new AppVersionRepository();
  constructor() {}

  /**
   * @static
   * @param {object} condition
   * @returns {Promise<IAppVersion>}
   * @memberof AppVersionService
   */
  static async findOne(condition: object): Promise<IAppVersion> {
    const retVal = await this.appVersionRepository.findOne(condition);
    return retVal as IAppVersion;
  }

  /**
   *
   * @static
   * @returns {Promise<IAppVersion[]>}
   * @memberof AppVersionService
   */
  static async find(): Promise<IAppVersion[]> {
    const retVal = await this.appVersionRepository.find({});
    return retVal as IAppVersion[];
  }

  /**
   * @static
   * @returns {Promise<IAppVersion[]>}
   * @memberof AppVersionService
   */
  static async list(): Promise<IAppVersion[]> {
    const inList = await this.find();
    return inList as IAppVersion[];
  }

  /**
   * @static
   * @param {IAppVersion} appVersion
   * @returns {Promise<IAppVersion>}
   * @memberof AppVersionService
   */
  static async create(appVersion: IAppVersion): Promise<IAppVersion> {
    const createdVersion = await this.appVersionRepository.create(appVersion);
    return createdVersion as IAppVersion;
  }

  /**
   * @static
   * @param {string} id
   * @returns {Promise<boolean>}
   * @memberof AppVersionService
   */
  static async delete(id: string): Promise<boolean> {
    const deletedVersion = await this.appVersionRepository.delete(id);
    return deletedVersion;
  }

  /**
   * @static
   * @param {string} id
   * @param {IAppVersion} appVersion
   * @returns {Promise<IAppVersion>}
   * @memberof AppVersionService
   */
  static async update(id: string, appVersion: IAppVersion): Promise<IAppVersion> {
    const updatedVersion = await this.appVersionRepository.findByIdAndUpdate(id, appVersion);
    return updatedVersion as IAppVersion;
  }

  /**
   * @static
   * @param {string} currentVersion
   * @param {string} platform
   * @returns {Promise<IAppVersion>}
   * @memberof AppVersionService
   */
  static async checkUpgrade(currentVersion: string, platform: string): Promise<IAppVersion> {
    const upgradeVersion: IAppVersion = await this.appVersionRepository.findOne({ platform }, { updatedDate: -1 });
    if (!upgradeVersion) {
      throw new HTTPError(`App version not found for platform ${platform}`, '404', 404);
    }

    const versionDiff = semverDiff(currentVersion, upgradeVersion.version);
    if (!upgradeVersion.checkUpgrade || !versionDiff) {
      upgradeVersion.updateStatus = AppUpdateStatus.None;
    } else if (['major', 'premajor'].includes(versionDiff)) {
      upgradeVersion.updateStatus = AppUpdateStatus.Force;
    } else {
      upgradeVersion.updateStatus = AppUpdateStatus.Soft;
    }

    const { updateStatus, updateUrl } = upgradeVersion;
    return { updateStatus, updateUrl };
  }
}
