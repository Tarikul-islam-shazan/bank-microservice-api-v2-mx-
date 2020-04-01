import { AxErrorMapper } from '../../../utils/error-mapper/axError';

export const AxErrorCodes = Object.freeze({
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
  INVALID_PHONE_NUMBER: {
    message: 'Invalid Phone Number',
    errorCode: '2201',
    httpCode: 400
  },
  INVALID_PROCESS_DATE: {
    message: 'Invalid Process Date',
    errorCode: '2202',
    httpCode: 400
  }
});

export class AxBillErrMapper extends AxErrorMapper {
  static additionalOTPResponse(err: any): any {
    const httpCode = this.getHttpCode(err);

    if (httpCode === 400) {
      return this.badRequestError(httpCode, err);
    }

    if (httpCode !== 403) {
      return this.getMappedError(httpCode, this.getMessage(err));
    }

    const { Code } = err.response.data;
    const otpID = err.response.headers['axxd-otp-id'] || err.response.headers['x-axxiome-digital-otp-id'];
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

  static badRequestError(httpCode: any, err: any): any {
    const { Data } = err.response.data;
    const errCode =
      Data && Array.isArray(Data.Errors) && Data.Errors.length > 0 && Data.Errors[0].ErrorCode
        ? Data.Errors[0].ErrorCode
        : '';

    switch (errCode) {
      // for add payee
      case 'invalidPhoneNumber':
        return AxErrorCodes.INVALID_PHONE_NUMBER;
      // for add payment
      case 'invalidProcessDate':
        return AxErrorCodes.INVALID_PROCESS_DATE;
      default:
        return this.getMappedError(httpCode, this.getMessage(err));
    }
  }
}
