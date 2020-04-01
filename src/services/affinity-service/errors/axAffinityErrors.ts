import { AxErrorMapper } from '../../../utils/error-mapper/axError';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const AxErrorCodes = Object.freeze({
  getSession: {
    SESSION_ID_NOT_FOUND: {
      message: 'Current user Session ID not found',
      errorCode: '201',
      httpCode: 400
    }
  },
  REQUEST_FAILED: {
    message: 'Affinity Request Failed',
    errorCode: '202',
    httpCode: 500
  }
});

export class AffinityErrorMapper extends AxErrorMapper {
  static getSessionError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    switch (httpCode) {
      case 400:
        return AxErrorCodes.getSession.SESSION_ID_NOT_FOUND;
      default:
        return this.getError(err);
    }
  }

  static getFailedError(err: any): IError {
    let message = AxErrorCodes.REQUEST_FAILED.message;

    if (err.error) {
      if (typeof err.error === 'string') {
        message = err.error;
      } else if (Object.keys(err.error).length > 0) {
        message = err.error[Object.keys(err.error)[0]].message || AxErrorCodes.REQUEST_FAILED.message;
      }
    }

    return { ...AxErrorCodes.REQUEST_FAILED, message };
  }
}
