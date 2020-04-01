import axios from 'axios';
import moment from 'moment';
import { EmailVerificationRepository } from './repository/email-verification-repository';
import { IEmailVerification } from './models/email-verification';
import config from '../../config/config';
import { HTTPError } from '../../utils/httpErrors';
import { EmailVerificationErrorCodes } from './errors';
import { IEmailVerificationResult } from '../models/verification/interface';
import { MeedAxios } from '../../utils/api';
import { MeedService } from '../meedservice/service';
import { ApplicationProgress } from '../models/meedservice';
export class VerificationService {
  public static MAX_WRONG_ATTEMPT_LIMIT = 3;
  private static VERIFICATION_CODE_EXPIRED_IN_MINUTES = 30;
  private static emailVerificationRepository = new EmailVerificationRepository();

  constructor() {}

  /**
   * Create a random verification code
   *
   * @static
   * @param {string} email any valid email address
   * @returns {Promise<IEmailVerification>}
   * @memberof VerificationService
   */
  static async createVerificationCode(email: string): Promise<{ verificationCode: string }> {
    const verificationCode: string = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerification: IEmailVerification = {
      email,
      validated: false,
      verificationCode,
      numberOfTries: 0,
      createdDate: moment.utc().toDate()
    };
    // check if email is a valid email address, allow disposable email for QA & development environment
    if (process.env.NODE_ENV !== 'qa' && process.env.NODE_ENV !== 'development') {
      const verifyResponse = await MeedAxios.getBriteVerifyInstance().get(
        `/?address=${email}&apikey=${config.briteVerify.key}`
      );

      if (
        verifyResponse?.data?.disposable === true ||
        verifyResponse?.data?.status === 'invalid' ||
        verifyResponse?.data?.status === 'unknown'
      ) {
        const {
          message,
          errorCode,
          httpCode
        } = EmailVerificationErrorCodes.createVerificationCode.INVALID_EMAIL_ADDRESS;
        throw new HTTPError(message, errorCode, httpCode);
      }
    }
    await this.emailVerificationRepository.create(emailVerification);
    return { verificationCode };
  }

  /**
   * Validate a code that sent to users email
   *
   * @static
   * @param {string} email user email address
   * @param {string} verificationCode code that user got in email
   * @memberof VerificationService
   */
  static async verifyEmailCode(email: string, verificationCode: string): Promise<IEmailVerificationResult> {
    const verification = await this.emailVerificationRepository.findLastInvitationCode(email);
    const response = {
      isValid: false
    };

    // check for invalid email address
    if (!verification) {
      const {
        message,
        errorCode,
        httpCode
      } = EmailVerificationErrorCodes.verifyEmailCode.NO_CODE_GENERATED_FOR_THIS_EMAIL;
      throw new HTTPError(message, errorCode, httpCode);
    }
    // check for max number of tries limit
    if (verification.numberOfTries >= this.MAX_WRONG_ATTEMPT_LIMIT) {
      const {
        message,
        errorCode,
        httpCode
      } = EmailVerificationErrorCodes.verifyEmailCode.NEW_VERIFICATION_CODE_IS_REQUIRED;
      throw new HTTPError(message, errorCode, httpCode);
    }
    // check if verification code is expired
    const currentTime = moment.utc();
    const invitationExpirationTime = moment
      .utc(verification.createdDate)
      .add(this.VERIFICATION_CODE_EXPIRED_IN_MINUTES, 'minutes');

    if (currentTime.isAfter(invitationExpirationTime)) {
      const { message, errorCode, httpCode } = EmailVerificationErrorCodes.verifyEmailCode.ACTIVATION_CODE_EXPIRED;
      throw new HTTPError(message, errorCode, httpCode);
    }
    // check for already used code
    if (verification.validated) {
      const {
        message,
        errorCode,
        httpCode
      } = EmailVerificationErrorCodes.verifyEmailCode.ALREADY_USED_VERIFICATION_CODE;
      throw new HTTPError(message, errorCode, httpCode);
    }

    // check verification code
    if (verification.verificationCode === verificationCode) {
      verification.validated = true;
      response.isValid = true;
      const member = await MeedService.findMemberByEmail(email);
      await MeedService.updateMember({
        id: (member as any)._id,
        applicationProgress: ApplicationProgress.EmailVerified
      });
      await this.emailVerificationRepository.findByIdAndUpdate(verification.id, verification);
      return response;
    }
    verification.numberOfTries++;
    await this.emailVerificationRepository.findByIdAndUpdate(verification.id, verification);
    // check max number of tries limit on updated value
    if (verification.numberOfTries >= this.MAX_WRONG_ATTEMPT_LIMIT) {
      const {
        message,
        errorCode,
        httpCode
      } = EmailVerificationErrorCodes.verifyEmailCode.NEW_VERIFICATION_CODE_IS_REQUIRED;
      throw new HTTPError(message, errorCode, httpCode);
    }
    return response;
  }
}
