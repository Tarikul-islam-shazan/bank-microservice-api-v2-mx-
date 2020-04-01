import { AxErrorMapper } from '../../../utils/error-mapper/axError';

export const AxErrorCodes = Object.freeze({
  UNABLE_TO_FIND_CUSTOMER: {
    message: 'Unable to find the customer',
    errorCode: '701',
    httpCode: 500
  },
  ALREADY_EXIST_MEMBER: {
    message: 'Email Address already exist',
    errorCode: '703',
    httpCode: 409
  },
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
  }
});

export class AxCustomerErrMapper extends AxErrorMapper {
  static additionalOTPResponse(err: any): any {
    const httpCode = this.getHttpCode(err);
    if (httpCode !== 403) {
      return this.getMappedError(httpCode, this.getMessage(err));
    }
    const { Code } = err.response.data;
    const otpID = err.response.headers['axxd-otp-id'];
    const message = err.response.data.message || err.response.data.Message;
    let errorCode;
    switch (Code) {
      case '1':
        errorCode = AxErrorCodes.INVALID_OTP_TOKEN.errorCode;
        return { code: errorCode, otpID, message, httpCode };
      case '2':
        errorCode = AxErrorCodes.TOO_MANY_ATTEMPTS.errorCode;
        return { code: errorCode, otpID, message, httpCode };
      case '3':
        errorCode = AxErrorCodes.TOKEN_EXPIRED.errorCode;
        return { code: errorCode, otpID, message, httpCode };
      default:
        errorCode = AxErrorCodes.ADDITIONAL_OTP_REQUIRED.errorCode;
        return { code: errorCode, otpID, message, httpCode };
    }
  }
}
