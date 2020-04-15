import DIContainer from './../../utils/ioc/ioc';
import { MeedRequest } from './../../interfaces/MeedRequest';
import { IMember } from '../models/meedservice/member';
import { Response } from 'express';
import { ApplicationProgress, ApplicationStatus } from '../models/meedservice/member';
import { ResponseMapper } from './mappers/';
import { OnboardingErrMapper, ErrorCodes } from './errors';
import { HTTPError } from '../../utils/httpErrors';
import { MeedService } from '../meedservice/service';
import { IOnboardingService, Credential } from '../models/bank-onboarding/interface';
import { TYPES } from '../../utils/ioc/types';

export class OnboardingController {
  private static createServiceAndSetAuth(req: MeedRequest): IOnboardingService {
    const service = DIContainer.getNamed<IOnboardingService>(TYPES.BankOnboarding, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    return service;
  }

  public static async createLogin(req: MeedRequest, res: Response): Promise<any> {
    const { username } = req.body;
    const memberId = req.headers['meedbankingclub-memberid'] as string;

    // TODO: Perhaps we can search by id and do the comparison here, that way we can reduce the number
    // of functions on MeedService for searching for a member.
    const existingMember = await MeedService.findMemberByUsername(username);

    if (existingMember) {
      // TODO: how we can set error code here ? how we can differentiate between multiple bank
      const { message, errorCode, httpCode } = ErrorCodes.createLogin.USER_NAME_ALREADY_EXISTS;
      throw new HTTPError(message, errorCode, httpCode);
    }

    // TODO: What happens if one of these failes how do we ensure both succeed or both fail.
    const customerId = await OnboardingController.createServiceAndSetAuth(req).createLogin(req.body as Credential);
    const member = await MeedService.updateMember({
      id: memberId,
      username,
      customerId,
      applicationProgress: ApplicationProgress.CredentialsCreated
    });
    res.status(200).json(member);
  }

  /**
   * User applied for bank account general information
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof OnboardingController
   * @version v1.0.0
   */
  public static async generalInformation(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).generalInformation(memberId, req.body);
    res.status(200).json(response);
  }

  /**
   * User applied for bank account with beneficiary information
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof OnboardingController
   * @version v1.0.0
   */
  public static async beneficiaryInformation(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const customerId = req.headers['meedbankingclub-customerid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).beneficiaryInformation(
      memberId,
      customerId,
      req.body
    );
    res.status(200).json(response);
  }

  //#region  get identity question

  /**
   * Retrive identity question
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof OnboardingController
   * @version v1.0.0
   */
  public static async getIdentityQuestions(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).getIdentityQuestions();
    await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.IdentityQuestionsViewed
    });
    res.status(200).json(response);
  }
  //#endregion

  //#region set identity question
  /**
   * Check identity question answers
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof OnboardingController
   */
  public static async setIdentityQuestionsAnswers(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    try {
      let response = await OnboardingController.createServiceAndSetAuth(req).setIdentityQuestionsAnswers(req.body);

      if (response.status === 200) {
        // http code 200 indicates that user has given wrong answer and new question will return to user.
        response = ResponseMapper.getIdentityQuestions(response.data);
      } else if (response.status === 201) {
        const mapping = ResponseMapper.applyForAccountComplete(response.data);
        // User's identity verification completed. Customer ID is created here.
        response = await MeedService.updateMember({
          id: memberId,
          customerId: (mapping as IMember).customerId,
          applicationProgress: ApplicationProgress.IdentityQuestionsAnswered
        });
      } else {
        throw new Error('Unknown status code in set identity question answer response');
      }
      res.status(200).json(response);
    } catch (error) {
      const { errorCode, httpCode } = OnboardingErrMapper.mapIdentityQuestionsAnswersError(error);
      if (httpCode === 406) {
        // Whenever http status code is 406, application is denied from axxiome
        // This can be for applicant is minor, deceased or credit report failure
        // TODO: We may need to store the reason of application denied
        await MeedService.updateMember({
          id: memberId,
          applicationProgress: ApplicationProgress.BankApplicationSubmitted,
          applicationStatus: ApplicationStatus.Denied
        });
      }
      throw new HTTPError(error.message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region get Terms and Condition
  /**
   * Get Terms and condition
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof OnboardingController
   * @version v1.0.0
   */
  public static async getTermsAndCondition(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.get('meedbankingclub-memberid');
    const response = await OnboardingController.createServiceAndSetAuth(req).getTermsAndConditions(memberId);
    res.status(200).json(response);
  }
  //#endregion

  //#region accept terms and condition
  /**
   * Accept terms and Condition
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof OnboardingController
   * @version v1.0.0
   */
  public static async acceptTermsAndConditions(req: MeedRequest, res: Response): Promise<any> {
    const { isTermsAccepted, processId, corporateTncAccepted } = req.body;
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    // TODO: How we manage processId ? request body or in header
    const response = await OnboardingController.createServiceAndSetAuth(req).acceptTermsAndConditions(
      memberId,
      isTermsAccepted,
      processId,
      corporateTncAccepted
    );
    res.status(201).json(response);
  }

  //#endregion

  public static async fundAccount(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).fundAccount(memberId, req.body);
    res.status(200).json(response);
  }

  public static async addressInfo(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).addressInfo(memberId, req.body);
    res.status(200).json(response);
  }

  public static async selectAccountLevel(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const { accountLevel } = req.body;
    const response = await OnboardingController.createServiceAndSetAuth(req).selectAccountLevel(memberId, accountLevel);

    res.status(200).json(response);
  }

  public static async personalInformation(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).personalInformation(memberId, req.body);
    res.status(200).json(response);
  }

  public static async govDisclosureInfo(req: MeedRequest, res: Response): Promise<void> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).govDisclosureInfo(memberId, req.body);
    res.status(200).json(response);
  }

  public static async fundProvider(req: MeedRequest, res: Response): Promise<any> {
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await OnboardingController.createServiceAndSetAuth(req).fundProvider(memberId, req.body);
    res.status(200).json(response);
  }
}
