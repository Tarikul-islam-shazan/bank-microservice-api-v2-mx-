import { Response, NextFunction } from 'express';
import { MeedRequest } from '../../interfaces/MeedRequest';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import logger from '../../utils/logger';
import { IBankCredentialService, IChallengeAnswers, IOtp } from '../models/bank-credentials-service/interface';
import { MeedService } from '../meedservice/service';
import { HTTPError } from '../../utils/httpErrors';
import { AxErrorCodes } from './errors';

class BankCredentialController {
  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof BankCredentialController
   */
  public static async forgotUsername(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;
    const member = await MeedService.findMemberByEmail(email);
    if (!member) {
      const { message, errorCode, httpCode } = AxErrorCodes.NO_MEMBER_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }

    const service = DIContainer.getNamed<IBankCredentialService>(TYPES.AxBankCredentials, member.bank.identifier);
    service.getAuthorizationService().setHeadersAndToken(req.headers);

    const response: string = await service.forgotUsername(email);
    res.status(200).json(response);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof BankCredentialController
   */
  public static async getChallengeQuestions(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const { username } = req.query;
    const member = await MeedService.findMemberByUsername(username);
    if (!member) {
      const { message, errorCode, httpCode } = AxErrorCodes.NO_MEMBER_FOUND;
      throw new HTTPError(message, errorCode, httpCode);
    }

    const bankIdentifier = member.bank.identifier;
    const service = DIContainer.getNamed<IBankCredentialService>(TYPES.AxBankCredentials, bankIdentifier);
    service.getAuthorizationService().setHeadersAndToken(req.headers);
    const questions = await service.getChallengeQuestions(username);

    res.set('MeedBankingClub-Bank-Identifier', bankIdentifier);
    if ((questions as IOtp).httpCode === 403) {
      res.set('meedbankingclub-otp-id', (questions as IOtp).otpID);
      delete (questions as IOtp).otpID;
      res.status(403).json({ data: questions });
    } else {
      res.status(200).json(questions);
    }
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof BankCredentialController
   */
  public static async validateChallengeQuestions(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = DIContainer.getNamed<IBankCredentialService>(TYPES.AxBankCredentials, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers);

    const response = await service.validateChallengeQuestions(req.body.username, req.body as IChallengeAnswers);
    res.status(200).json(response);
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof BankCredentialController
   */
  public static async resetPassword(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = DIContainer.getNamed<IBankCredentialService>(TYPES.AxBankCredentials, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers);

    const response = await service.resetPassword(req.body.username, req.body.key, req.body.password);
    res.status(200).json(response);
  }

  public static async changePassword(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = DIContainer.getNamed<IBankCredentialService>(TYPES.AxBankCredentials, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const { username, currentPassword, newPassword } = req.body;
    const response = await service.changePassword(username, currentPassword, newPassword);
    res.status(200).json(true);
  }
}

export default BankCredentialController;
