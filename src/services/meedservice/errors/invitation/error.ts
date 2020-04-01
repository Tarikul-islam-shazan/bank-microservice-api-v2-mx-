import { ErrorMapper, IError } from '../../../../utils/error-mapper/errorMapper';

export const InvitationErrCodes = Object.freeze({
  ALREADY_A_MEMBER: {
    message: 'The invitee is already a member',
    errorCode: '901'
  },
  FAILED: {
    message: 'Failed to send invitation',
    errorCode: '902'
  }
});

export class InvitationErrMapper extends ErrorMapper {
  /**
   * @static
   * @param {*} err
   * @returns {IError}
   * @memberof InvitationErrMapper
   */
  static sendGridError(err: any): IError {
    const httpCode = this.getHttpCode(err);
    if (err.response && err.response.body && err.response.body.errors && err.response.body.errors.length > 0) {
      return { httpCode, message: err.response.body.errors[0].message, errorCode: String(httpCode) };
    }
    return { httpCode, ...InvitationErrCodes.FAILED };
  }
}
