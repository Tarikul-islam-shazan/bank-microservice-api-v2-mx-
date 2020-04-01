import HttpStatus from 'http-status-codes';
import { ErrorMapper, IError } from '../../../utils/error-mapper/errorMapper';

export const uasErrCodes = {
  NO_NAMED_ID_ASSOCIATED: {
    message: 'Nameduser is not associated with any urban airship channel',
    errorCode: '2400',
    httpCode: 404
  }
};

export class UasErrorMapper extends ErrorMapper {
  static uasError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    const message = this.uasErrMsg(err);
    return {
      httpCode,
      message: message || HttpStatus.getStatusText(httpCode),
      errorCode: String(httpCode)
    };
  }

  static uasLookupError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    return httpCode === 404 ? uasErrCodes.NO_NAMED_ID_ASSOCIATED : this.uasError(err);
  }

  private static uasErrMsg(err: any): string {
    const data = err.response && err.response.data ? err.response.data : {};
    if (typeof data === 'string') {
      return data;
    } else if (data.details && data.details.error && typeof data.details.error === 'string') {
      return data.details.error;
    } else if (data.error && typeof data.error === 'string') {
      return data.error;
    }
    return '';
  }
}
