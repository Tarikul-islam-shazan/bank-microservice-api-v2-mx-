import { AxErrorMapper } from '../../../utils/error-mapper/axError';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const AxErrorCodes = Object.freeze({
  login: {
    ACCOUNT_IS_LOCKED: {
      message: 'Your account is locked',
      errorCode: '401',
      httpCode: 400
    },
    INCORRECT_CREDENTIALS: {
      message: 'Username or password is incorrect',
      errorCode: '402',
      httpCode: 401
    }
  },
  INCORRECT_ANSWER: {
    message: 'Your answer is incorrect',
    errorCode: '403',
    httpCode: 400
  },
  PASSWORD_USED_EARLIER: {
    message: 'This password has been used in earlier. Please choose a different password.',
    errorCode: '404',
    httpCode: 409
  },
  ACCOUNT_LOCK: {
    message: 'Your account is locked',
    errorCode: '405',
    httpCode: 423
  },
  // NOTE: need to create an common OTP error code for all the services otp errors
  ADDITIONAL_OTP_REQUIRED: {
    message: 'Additional otp required',
    errorCode: '702',
    httpCode: 403
  },
  INVALID_OTP_TOKEN: {
    message: 'Invalid token',
    errorCode: '704',
    httpCode: 403
  },
  TOO_MANY_ATTEMPTS: {
    message: 'Too many attempts',
    errorCode: '705',
    httpCode: 403
  },
  TOKEN_EXPIRED: {
    message: 'OTP Token expired',
    errorCode: '706',
    httpCode: 403
  },
  NO_MEMBER_FOUND: {
    message: 'No member found',
    errorCode: '410',
    httpCode: 404
  },
  PASSWORD_IS_SAME: {
    message: 'New password should not be same as current password',
    errorCode: '412',
    httpCode: 400
  },
  CURRENT_PASSWORD_INCORRECT: {
    message: 'The password you have entered does not match your current password',
    errorCode: '413',
    httpCode: 400
  }
});

export class CredErrorMapper extends AxErrorMapper {
  /**
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof CredErrorMapper
   */
  static loginError(err: any): IError {
    const httpCode = this.getHttpCode(err);

    switch (httpCode) {
      case 401:
        const axErrCode = err.response && err.response.data ? err.response.data.code : 0;
        return axErrCode === 3 ? AxErrorCodes.login.ACCOUNT_IS_LOCKED : AxErrorCodes.login.INCORRECT_CREDENTIALS;
      default:
        return this.getMappedError(httpCode, this.getMessage(err));
    }
  }

  /**
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof CredErrorMapper
   */
  static validateChallengeQuestions(err: any): IError {
    const httpCode = this.getHttpCode(err);
    const message = this.getMessage(err);
    switch (httpCode) {
      case 400:
      case 412:
        return {
          errorCode: AxErrorCodes.INCORRECT_ANSWER.errorCode,
          httpCode: AxErrorCodes.INCORRECT_ANSWER.httpCode,
          message: message || AxErrorCodes.INCORRECT_ANSWER.message
        };
      case 423:
        return {
          errorCode: AxErrorCodes.ACCOUNT_LOCK.errorCode,
          httpCode: AxErrorCodes.ACCOUNT_LOCK.httpCode,
          message: message || AxErrorCodes.ACCOUNT_LOCK.message
        };
      default:
        return this.getMappedError(httpCode, message);
    }
  }

  /**
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof CredErrorMapper
   */
  static resetPassword(err: any): IError {
    const httpCode = this.getHttpCode(err);
    const message = this.getMessage(err);
    switch (httpCode) {
      case 412:
        return {
          errorCode: AxErrorCodes.PASSWORD_USED_EARLIER.errorCode,
          httpCode: AxErrorCodes.PASSWORD_USED_EARLIER.httpCode,
          message: message || AxErrorCodes.PASSWORD_USED_EARLIER.message
        };
      default:
        return this.getMappedError(httpCode, message);
    }
  }

  /**
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof CredErrorMapper
   */
  static getChallengeQuestions(err: any): any {
    const httpCode = this.getHttpCode(err);

    if (httpCode === 423) {
      return AxErrorCodes.ACCOUNT_LOCK;
    }

    let message = this.getMessage(err);
    if (httpCode !== 403) {
      return this.getMappedError(httpCode, message);
    }

    const { Code } = err.response.data;
    const otpID = err.response.headers['axxd-otp-id'] || err.response.headers['x-axxiome-digital-otp-id'];
    let errorCode;
    switch (Code) {
      case '1':
        errorCode = AxErrorCodes.INVALID_OTP_TOKEN.errorCode;
        message = message || AxErrorCodes.INVALID_OTP_TOKEN.message;
        return { code: errorCode, otpID, message, httpCode };
      case '2':
        errorCode = AxErrorCodes.TOO_MANY_ATTEMPTS.errorCode;
        message = message || AxErrorCodes.TOO_MANY_ATTEMPTS.message;
        return { code: errorCode, otpID, message, httpCode };
      case '3':
        errorCode = AxErrorCodes.TOKEN_EXPIRED.errorCode;
        message = message || AxErrorCodes.TOKEN_EXPIRED.message;
        return { code: errorCode, otpID, message, httpCode };
      default:
        errorCode = AxErrorCodes.ADDITIONAL_OTP_REQUIRED.errorCode;
        message = message || AxErrorCodes.ADDITIONAL_OTP_REQUIRED.message;
        return { code: errorCode, otpID, message, httpCode };
    }
  }

  /**
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof CredErrorMapper
   */
  static changePassword(err: any): IError {
    const httpCode = this.getHttpCode(err);
    const message = this.getMessage(err);
    switch (httpCode) {
      case 409:
        return AxErrorCodes.PASSWORD_IS_SAME;
      case 401:
        return AxErrorCodes.CURRENT_PASSWORD_INCORRECT;
      default:
        return this.getMappedError(httpCode, message);
    }
  }
}
