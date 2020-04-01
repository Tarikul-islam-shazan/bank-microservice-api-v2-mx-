import { AxErrorMapper } from '../../../utils/error-mapper/axError';
import { HTTPError } from '../../../utils/httpErrors';

export const p2pErrors = Object.freeze({
  RECIPIENT_NOT_FOUND: {
    message: 'Unable to get recipients',
    errorCode: '2100',
    httpCode: 404
  },
  DUPLICATE_PAYMENT: {
    message: 'Duplicate payment alert',
    errorCode: '2101',
    httpCode: 409
  },
  INSUFFICIENT_BALANCE: {
    message: 'Insufficient Available Balance',
    errorCode: '2102',
    httpCode: 422
  },
  INVALID_PHONE_NUMBER: {
    message: 'Invalid Phone Number',
    errorCode: '2103',
    httpCode: 400
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

export class P2PErrors extends AxErrorMapper {
  static extractError(err: any): any {
    if (err instanceof HTTPError) {
      throw err;
    }

    if (
      (err?.response?.status === 403 && err?.response?.data && !err?.response?.data?.Code) ||
      (err?.response?.status === 403 && err?.response?.data?.Code)
    ) {
      const otpError: any = this.additionalOTPResponse(err);
      return otpError;
    } else if (
      err?.response?.status === 422 &&
      err?.response?.data?.Data?.Error[0]?.ErrorCode === 'insufficientBalance'
    ) {
      return p2pErrors.INSUFFICIENT_BALANCE;
    } else if (err.message === 'duplicatePayment') {
      return p2pErrors.DUPLICATE_PAYMENT;
    } else if (
      err?.response?.status === 400 &&
      err?.response?.data?.Data?.Error[0]?.ErrorCode === 'invalidPhoneNumber'
    ) {
      return p2pErrors.INVALID_PHONE_NUMBER;
    } else {
      return this.getError(err);
    }
  }

  static additionalOTPResponse(err: any): any {
    const httpCode = this.getHttpCode(err);
    if (httpCode !== 403) {
      return this.getMappedError(httpCode, this.getMessage(err));
    }

    const { Code } = err?.response?.data;
    const otpID = err?.response?.headers['axxd-otp-id'] || err?.response?.headers['x-axxiome-digital-otp-id'];
    const message = err?.response?.data?.message || err?.response?.data?.Message;

    let errorCode;
    switch (Code) {
      case '1':
        errorCode = p2pErrors.INVALID_OTP_TOKEN.errorCode;
        return { code: errorCode, otpID, message, httpCode };
      case '2':
        errorCode = p2pErrors.TOO_MANY_ATTEMPTS.errorCode;
        return { code: errorCode, otpID, message, httpCode };
      case '3':
        errorCode = p2pErrors.TOKEN_EXPIRED.errorCode;
        return { code: errorCode, otpID, message, httpCode };
      default:
        errorCode = p2pErrors.ADDITIONAL_OTP_REQUIRED.errorCode;
        return { code: errorCode, otpID, message, httpCode };
    }
  }
}
