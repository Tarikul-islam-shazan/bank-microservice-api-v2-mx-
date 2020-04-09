import HttpStatus from 'http-status-codes';
import { HTTPError } from '../httpErrors';
import { InvexResponseData } from '../../interfaces/invex-response';
import { IError } from './errorMapper';

export const INTERNAL_SERVER_ERROR: IError = {
  message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
  httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
  errorCode: '5000'
};

export class IvxErrorMapper {
  /**
   * @param {InvexResponseData} response
   * @memberof IvxErrorMapper
   */
  static checkSuccess(response: InvexResponseData): void {
    // No Connection or the Method is not activated in the central bus
    if (response.codRet !== '000') {
      const { message, errorCode, httpCode } = INTERNAL_SERVER_ERROR;
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
