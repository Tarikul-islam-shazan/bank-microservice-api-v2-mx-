import { Request, Response, NextFunction } from 'express';
import { MeedService } from '../../service';
import { IMember } from '../../../models/meedservice/member';
import { CountryService } from '../../atomic-services/country';
import { StaticDataService } from '../../atomic-services/static-data';

export class MeedOnboardingController {
  //#region Meed Onboarding

  /**
   *  Used to create the member record with just the email. If email already exists then the existing
   * record will be returned and no new one will be created. So this should not ever have any error other
   * than a server error.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<any>}
   * @memberof MeedOnboardingController
   */
  public static async createOnboarding(req: Request, res: Response): Promise<any> {
    const { email } = req.body;
    const response = await MeedService.createOnboarding(email);
    if (response.bankIdentifier) {
      res.set('meedbankingclub-bank-identifier', response.bankIdentifier);
    }
    res.status(201).json(response.member);
  }

  /**
   * TODO we can call MemberService.validateInviter here. those are same. should we do that ?
   *
   * This is used to validate whether the inviter is actually valid or not. Because of security reasons
   * we cannot just allow a search to return the found object during onboarding, otherwise the api is open
   * to anyone to constantly query the backend and get our member info.
   *
   * So this will just check if the member exists and is in a valid state with registration completed.
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<any>}
   * @memberof MeedController
   */
  public static async validateInviter(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { inviterEmail, inviterCode, inviter } = req.query;
    const validationResult = await MeedService.validateInviter({ inviterEmail, inviterCode, inviter });
    res.status(200).json(validationResult);
  }

  /**
   * Update the onboarding member record, but only allow those fields to be updated which are part of the onboarding.
   * Currently the only allowed update fields are below:
   *  - inviter (inviterCode or inviterEmail)
   *  - nickname
   *  - country
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<any>}
   * @memberof MeedOnboardingController
   */
  public static async updateOnboarding(req: Request, res: Response, next: NextFunction): Promise<any> {
    const requestedMember = req.body as IMember;

    // update the member and examine what is updated. based on that insert new transition
    const member = await MeedService.compressedSignup({ ...requestedMember, id: req.params.id });
    if (member?.identifier) {
      res.set('MeedBankingClub-Bank-Identifier', member.identifier);
    }

    res.status(200).json(member);
  }

  /**
   * Get all countries with id and short name
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof MeedOnboardingController
   */
  public static async getCountries(req: Request, res: Response, next: NextFunction) {
    const countries = await CountryService.find('');
    res.status(200).json(countries);
  }

  /**
   * Get and Return States of a country
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @memberof MeedOnboardingController
   */
  public static async getStates(req: Request, res: Response): Promise<void> {
    const states = await MeedService.getAllStates(req.params.countryId);
    res.status(200).json({ states });
  }

  //#endregion
}
