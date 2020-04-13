import { IvxErrorMapper, INTERNAL_SERVER_ERROR } from '../../../utils/error-mapper/ivx-error-mapper';
import { InvexResponseData, InvexResponse } from '../../../interfaces/invex-response';
import { HTTPError } from '../../../utils/httpErrors';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const OnboardErrCodes = Object.freeze({
  USERNAME_ALREADY_EXISTS: {
    message: 'Username already exists',
    errorCode: '602',
    httpCode: 409
  },
  CUSTOMERID_ALREADY_EXISTS: {
    message: 'Customer id already exists',
    errorCode: '603',
    httpCode: 409
  },
  addressInfo: {
    POST_CODE_NOT_EXISTS: {
      message: 'Post code does not exist',
      errorCode: '616',
      httpCode: 400
    }
  }
});

export class IvxOnboardErrMapper extends IvxErrorMapper {
  static createLogin(response: InvexResponseData): InvexResponse | InvexResponse[] {
    // will throw error if 'codRet' is not success i,e '000'
    this.checkSuccess(response);

    let err: IError;
    switch (response.busqueda[0]?.respcode) {
      case '000':
      case '100':
        return response.busqueda as InvexResponse[];
      case '113':
        return this.throwError(OnboardErrCodes.USERNAME_ALREADY_EXISTS);
      case '111':
        return this.throwError(OnboardErrCodes.CUSTOMERID_ALREADY_EXISTS);
      default:
        return this.throwError(INTERNAL_SERVER_ERROR);
    }
  }

  static stateCityMunicipality(response: InvexResponseData): InvexResponse | InvexResponse[] {
    // will throw error if 'codRet' is not success i,e '000'
    this.checkSuccess(response);

    let err: IError;
    switch (response.busqueda[0]?.respcode) {
      case '000':
        return response.busqueda as InvexResponse[];
      case '100':
        return this.throwError(OnboardErrCodes.addressInfo.POST_CODE_NOT_EXISTS);
      default:
        return this.throwError(INTERNAL_SERVER_ERROR);
    }
  }
}
