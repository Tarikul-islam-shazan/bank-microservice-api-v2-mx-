import HttpStatus from 'http-status-codes';
import { HTTPError } from '../httpErrors';

export interface IError {
  message: string | object;
  errorCode: string;
  httpCode: number;
}

export const SESSION_TIMEOUT_ERROR = {
  message: 'Session timeout',
  errorCode: '303',
  httpCode: 401
};

// TODO: getError & getMappedError can be merged using method overloading, but TS doesn't support it
export abstract class ErrorMapper {
  /**
   * @static
   * @param {number} code
   * @param {string} message
   * @returns {IError}
   * @memberof ErrorMapper
   */
  static getError(err: any): IError {
    const code = this.getHttpCode(err);
    return {
      message: err.message || HttpStatus.getStatusText(code),
      errorCode: '5001',
      httpCode: code
    };
  }
  /**
   * @static
   * @param {number} code
   * @param {string} message
   * @returns {IError}
   * @memberof ErrorMapper
   */
  static getMappedError(code: number, message?: string | object): IError {
    // handle common session timeout error
    if (code === 401) {
      return SESSION_TIMEOUT_ERROR;
    }

    return {
      message: message || HttpStatus.getStatusText(code),
      errorCode: '5001',
      httpCode: code
    };
  }
  /**
   * Return the http code from axios error response, can be override in derived class according to banks
   *
   * @static
   * @param {*} err
   * @returns {number}
   * @memberof ErrorMapper
   */
  static getHttpCode(err: any): number {
    if (err instanceof HTTPError) {
      return err.statusCode;
    }
    return err.response && err.response.status ? err.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
