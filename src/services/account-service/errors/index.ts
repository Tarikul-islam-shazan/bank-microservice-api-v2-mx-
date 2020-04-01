import { AxErrorMapper } from '../../../utils/error-mapper/axError';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const AccountServiceErrors = Object.freeze({
  UNABLE_TO_UPDATE_STATE: {
    message: 'Unable to update sweep account state',
    errorCode: '100',
    httpCode: 422
  }
});

export class AxAccountError extends AxErrorMapper {
  static extractError(err): IError {
    const httpCode = this.getHttpCode(err);
    switch (httpCode) {
      case 422: {
        let errorCode =
          err.response?.data?.Data?.Error?.length > 0 ? err.response?.data?.Data?.Error[0]?.ErrorCode : '';
        if (errorCode === 'nonBusinessDayError') {
          return AccountServiceErrors.UNABLE_TO_UPDATE_STATE;
        } else {
          return this.getError(err);
        }
      }
      default:
        return this.getError(err);
    }
  }
}
