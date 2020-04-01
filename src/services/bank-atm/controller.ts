import { Response, NextFunction } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';
import { BankAtmService } from './service';
import { IBankAtm } from '../models/bank-atms/interface';

class BankAtmController {
  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof BankAtmController
   */
  public static async getAtmList(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const { distance, locationType, latitude, longitude, unitOfMeasure = null, address = null } = req.query;

    const atmList: IBankAtm[] = await BankAtmService.findNearby(
      { distance, locationType, latitude, longitude, bank: req.params.bankId } as IBankAtm,
      unitOfMeasure,
      address
    );

    res.json(atmList);
  }
}

export default BankAtmController;
