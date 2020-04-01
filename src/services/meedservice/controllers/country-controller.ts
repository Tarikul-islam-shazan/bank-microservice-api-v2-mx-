import { CountryService } from './../atomic-services/country';
import { Request, Response, NextFunction } from 'express';

export class CountryController {
  //#region Country
  public static async findCountries(req: Request, res: Response, next: NextFunction): Promise<any> {
    const response = await CountryService.find('');
    res.status(200).json({ data: response });
  }

  public static async updateCountry(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async deleteCountry(req: Request, res: Response, next: NextFunction): Promise<any> {}

  public static async findCountryById(req: Request, res: Response, next: NextFunction): Promise<any> {}
  //#endregion
}
