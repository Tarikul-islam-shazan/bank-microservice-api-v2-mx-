import { ErrorMapper, IError } from '../../../utils/error-mapper/errorMapper';

export const JumioErrors = Object.freeze({
  JUMIO_BAD_REQUEST: {
    message: 'Unable to get Jumio Data',
    errorCode: '2001',
    httpCode: 400
  },
  VERIFICATION_STATUS_FAILED: {
    message: 'jumio verification faild',
    errorCode: '2002',
    httpCode: 200
  },
  VERIFICATION_STATUS_PENDING: {
    message: 'jumio verfication status pending',
    errorCode: '2003',
    httpCode: 200
  }
});

export class JumioErrorsMapper extends ErrorMapper {
  static getJumioError(err): IError {
    const httpCode =
      (err.response && err.response.status) || (err.response && err.response.data && err.response.data.status);

    switch (String(httpCode)) {
      case '400':
        return JumioErrors.JUMIO_BAD_REQUEST;
      default:
        return this.getError(err);
    }
  }
}
