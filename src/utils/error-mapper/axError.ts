import HttpStatus from 'http-status-codes';
import { IError, ErrorMapper, SESSION_TIMEOUT_ERROR } from './errorMapper';
import { HTTPError } from '../httpErrors';

export class AxErrorMapper extends ErrorMapper {
  /**
   * Extract message from error for axiome
   * @static
   * @param {*} err
   * @returns {string}
   * @memberof AxErrorMapper
   */
  static getMessage(err: any): string {
    if (err instanceof HTTPError) {
      return err.errors.message;
    }
    const data = err.response && err.response.data ? err.response.data : {};

    if (data && typeof data === 'string') {
      return data;
    } else if (data.Data && data.Data.Error) {
      if (Array.isArray(data.Data.Error) && data.Data.Error.length > 0) {
        return data.Data.Error[0].Message;
      } else if (data.Data.Error.Message) {
        return data.Data.Error.Message;
      }
    } else if (data.Error && typeof data.Error === 'string') {
      return data.Error;
    } else if (data.Data && data.Data.Errors) {
      if (Array.isArray(data.Data.Errors) && data.Data.Errors.length > 0) {
        return data.Data.Errors[0].Message || data.Data.Errors[0].message || '';
      } else if (typeof data.Data.Errors === 'string') {
        return data.Data.Errors;
      } else {
        return data.Data.Errors.Message || data.Data.Errors.message || '';
      }
    } else if (data.message && typeof data.message === 'string') {
      return data.message;
    } else if (data.Message && typeof data.Message === 'string') {
      return data.Message;
    }

    return '';
  }

  /**
   * Override this for axiome to get a custom message from error
   * @override
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof AxErrorMapper
   */
  static getError(err: any): IError {
    const code = this.getHttpCode(err);
    const message = this.getMessage(err);

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
   * Override this to get http code from axiome jse_cause, Need to figure it out if they are same as response status
   * @override
   * @static
   * @param {*} err
   * @returns {number}
   * @memberof AxErrorMapper
   */
  static getHttpCode(err: any): number {
    if (err instanceof HTTPError) {
      return err.statusCode;
    }
    return err.jse_cause && err.jse_cause.response
      ? err.jse_cause.response.status
      : err.response && err.response.status
      ? err.response.status
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
