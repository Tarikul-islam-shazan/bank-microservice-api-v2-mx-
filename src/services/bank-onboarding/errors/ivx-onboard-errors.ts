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
    },
    CUSTOMERID_NOT_EXISTS: {
      message: 'The Customer Id provided does not exist.',
      errorCode: '617',
      httpCode: 400
    },
    CUSTOMERID_NOT_RELATED_TO_EXISTING_CUSTOMER: {
      message: 'The Meed ID is not related to an existing customer.',
      errorCode: '618',
      httpCode: 400
    },
    ADDRESS_INCORRECT: {
      message: 'The value for Type of Address is incorrect.',
      errorCode: '619',
      httpCode: 400
    },
    REAL_STATE_INCORRECT: {
      message: 'The value for Type of real Estate is incorrect.',
      errorCode: '620',
      httpCode: 400
    },
    POST_CODE_INCORRECT: {
      message: 'The value for Zip Code is incorrect.',
      errorCode: '621',
      httpCode: 400
    },
    STATE_INCORRECT: {
      message: 'The value for State is incorrect.',
      errorCode: '622',
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

  static addressInfo(response: InvexResponseData): InvexResponse | InvexResponse[] {
    // will throw error if 'codRet' is not success i,e '000'
    this.checkSuccess(response);

    let err: IError;
    switch (response.busqueda[0]?.respcode) {
      case '000':
        return response.busqueda as InvexResponse[];
      case '122':
        return this.throwError(OnboardErrCodes.addressInfo.CUSTOMERID_NOT_EXISTS);
      case '135':
        return this.throwError(OnboardErrCodes.addressInfo.CUSTOMERID_NOT_RELATED_TO_EXISTING_CUSTOMER);
      case '157':
        return this.throwError(OnboardErrCodes.addressInfo.ADDRESS_INCORRECT);
      case '159':
        return this.throwError(OnboardErrCodes.addressInfo.REAL_STATE_INCORRECT);
      case '161':
        return this.throwError(OnboardErrCodes.addressInfo.POST_CODE_INCORRECT);
      case '163':
        return this.throwError(OnboardErrCodes.addressInfo.STATE_INCORRECT);
      default:
        return this.throwError(INTERNAL_SERVER_ERROR);
    }
  }
}
