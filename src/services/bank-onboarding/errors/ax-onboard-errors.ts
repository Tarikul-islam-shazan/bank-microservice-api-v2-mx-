import { AxErrorMapper } from '../../../utils/error-mapper/axError';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const ErrorCodes = Object.freeze({
  getAccessToken: {
    UNABLE_GET_TOKEN: '601'
  },
  createLogin: {
    USER_NAME_ALREADY_EXISTS: {
      message: 'Username already exists',
      errorCode: '602',
      httpCode: 409
    }
  },
  applyForAccount: {
    DUPLICATE_TIN_NUMBER: {
      message: 'A member with this TIN number is already exists',
      errorCode: '603',
      httpCode: 409
    },
    APPLICANT_MINOR: {
      message: 'Applicant is not eligible',
      errorCode: '604',
      httpCode: 406
    },
    APPLICANT_DECEASED: {
      message: 'Application is deceased',
      errorCode: '605',
      httpCode: 406
    },
    NOT_ACCEPTABLE: {
      message: 'Application is not acceptable',
      errorCode: '606',
      httpCode: 406
    },
    IDENTITY_VERIFICATION_NOT_FOUND: {
      message: 'Identity verification not found',
      errorCode: '607',
      httpCode: 422
    },
    APPLICATION_DENIED: {
      message: 'Application denied',
      errorCode: '608',
      httpCode: 406
    },
    CREDIT_REPORT_FAILED: {
      message: 'Application denied for credit report failure',
      errorCode: '609',
      httpCode: 406
    },
    IDA_TRANSACTION_FAILED: {
      message: 'The IDA transaction could not be processed successfully',
      errorCode: '610',
      httpCode: 412
    },
    NOT_ELIGIBLE_FOR_QUESTION: {
      message: 'Not eligible for questions',
      errorCode: '611',
      httpCode: 412
    },
    IDENTITY_VERIFICATION_FAILED: {
      message: 'Identity verification failed',
      errorCode: '612',
      httpCode: 412
    }
  }
});

export class OnboardingErrMapper extends AxErrorMapper {
  /**
   * @static
   * @param {number} httpCode
   * @returns {IError}
   * @memberof AxxiomeErrorMapper
   */
  static mapCreateLoginError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    switch (httpCode) {
      case 409:
        return ErrorCodes.createLogin.USER_NAME_ALREADY_EXISTS;
      default:
        return this.getMappedError(httpCode, this.getMessage(err));
    }
  }

  static mapApplyForAccountError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    let axiomErrorCode = '';

    switch (httpCode) {
      case 409:
        return ErrorCodes.applyForAccount.DUPLICATE_TIN_NUMBER;
      case 406: {
        axiomErrorCode = err?.response?.data?.Data?.Error[0]?.ErrorCode;

        if (axiomErrorCode === 'customerIsMinor') {
          return ErrorCodes.applyForAccount.APPLICANT_MINOR;
        } else if (axiomErrorCode === 'customerIsDeceased') {
          return ErrorCodes.applyForAccount.APPLICANT_DECEASED;
        } else if (axiomErrorCode === 'creditReportFailed') {
          return ErrorCodes.applyForAccount.CREDIT_REPORT_FAILED;
        } else {
          return ErrorCodes.applyForAccount.NOT_ACCEPTABLE;
        }
      }
      case 422:
        return ErrorCodes.applyForAccount.IDENTITY_VERIFICATION_NOT_FOUND;
      case 412:
        axiomErrorCode = err?.response?.data?.Data?.Error[0]?.ErrorCode;
        if (axiomErrorCode === 'idaError_4019') {
          return ErrorCodes.applyForAccount.IDA_TRANSACTION_FAILED; // 08
        } else if (axiomErrorCode === 'idaError_4025') {
          return ErrorCodes.applyForAccount.NOT_ELIGIBLE_FOR_QUESTION; // 09
        } else {
          return ErrorCodes.applyForAccount.IDENTITY_VERIFICATION_FAILED; // 06
        }
      default:
        return this.getMappedError(httpCode, this.getMessage(err));
    }
  }

  static mapIdentityQuestionsAnswersError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    switch (httpCode) {
      case 406:
        const axxErrorCode = err?.response?.data?.Data?.Error[0]?.ErrorCode;
        if (axxErrorCode === 'creditReportFailed') {
          return ErrorCodes.applyForAccount.CREDIT_REPORT_FAILED;
        } else if (axxErrorCode === 'customerIsMinor') {
          return ErrorCodes.applyForAccount.APPLICANT_MINOR;
        } else if (axxErrorCode === 'customerIsDeceased') {
          return ErrorCodes.applyForAccount.APPLICANT_DECEASED;
        }
        return ErrorCodes.applyForAccount.APPLICATION_DENIED;
      default:
        return this.getMappedError(httpCode, this.getMessage(err));
    }
  }
}
