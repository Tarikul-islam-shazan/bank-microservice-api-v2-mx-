import { ErrorMapper } from '../../../utils/error-mapper/errorMapper';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const AtmErrorCodes = {
  NO_BANK_FOUND: {
    message: 'No bank found',
    errorCode: '1701',
    httpCode: 404
  },
  NO_ADDRESS_RESULT: {
    message: 'No location found within this address',
    errorCode: '1702',
    httpCode: 404
  }
};

export class AtmErrMapper extends ErrorMapper {
  /**
   * Get google map errors
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof AtmErrMapper
   */
  static gmapError(err: any): IError {
    if (err.json && err.json.error_message) {
      const httpCode = err.status;
      const message = err.json.error_message;
      return { message, httpCode, errorCode: String(httpCode) };
    }
    return this.getError(err);
  }
}
