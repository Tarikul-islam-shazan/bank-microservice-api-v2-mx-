import { Response, NextFunction } from 'express';
import { MeedRequest } from '../../../interfaces/MeedRequest';
import { AppVersionService } from '../atomic-services/app-version';
import { IAppVersion } from '../../models/meedservice/app-version';

export class AppVersionController {
  public static async list(req: MeedRequest, res: Response, next: NextFunction): Promise<any> {
    const versions = await AppVersionService.list();
    res.json(versions);
  }

  public static async create(req: MeedRequest, res: Response, next: NextFunction): Promise<any> {
    const appVersion: IAppVersion = req.body;
    const newVersion = await AppVersionService.create(appVersion);
    res.json(newVersion);
  }

  public static async delete(req: MeedRequest, res: Response, next: NextFunction): Promise<any> {
    await AppVersionService.delete(req.params.id);
    res.status(204).json();
  }

  public static async update(req: MeedRequest, res: Response, next: NextFunction): Promise<any> {
    const appVersion: IAppVersion = req.body;
    const updatedVersion = await AppVersionService.update(req.params.id, appVersion);
    res.json(updatedVersion);
  }

  public static async checkUpgrade(req: MeedRequest, res: Response, next: NextFunction): Promise<any> {
    const { currentVersion, platform } = req.query;
    const upgradeVersion = await AppVersionService.checkUpgrade(currentVersion, platform);
    res.json(upgradeVersion);
  }
}
