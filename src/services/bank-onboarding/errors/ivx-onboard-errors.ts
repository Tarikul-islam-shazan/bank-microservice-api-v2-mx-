import { IvxErrorMapper, INTERNAL_SERVER_ERROR } from '../../../utils/error-mapper/ivx-error-mapper';
import { InvexResponseData, InvexResponse } from '../../../interfaces/invex-response';

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
  beneficiary: {
    INSUFFICIENT_DATA: {
      message: 'Insufficient Data',
      errorCode: '623',
      httpCode: 409
    },
    CLIENT_ALREADY_EXISTS: {
      message: 'Client Already Exists',
      errorCode: '624',
      httpCode: 409
    },
    MEEDID_ALREADY_ASSIGNED: {
      message: 'Id Meed has ALREADY been assigned to another client.',
      errorCode: '625',
      httpCode: 409
    },
    MEED_CUSTID_INVALID: {
      message: 'Meed Cust ID does not exist',
      errorCode: '626',
      httpCode: 409
    }
  }
});

export class IvxOnboardErrMapper extends IvxErrorMapper {
  static createLogin(response: InvexResponseData): InvexResponse | InvexResponse[] {
    // will throw error if 'codRet' is not success i,e '000'
    this.checkSuccess(response);

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

  static beneficiaryInfo(response: InvexResponseData): InvexResponse[] {
    this.checkSuccess(response);

    switch (response.busqueda[0]?.respcode) {
      case '000':
        return response.busqueda;
      case '110':
        return this.throwError(OnboardErrCodes.beneficiary.INSUFFICIENT_DATA);
      case '106':
        return this.throwError(OnboardErrCodes.beneficiary.CLIENT_ALREADY_EXISTS);
      case '107':
        return this.throwError(OnboardErrCodes.beneficiary.MEEDID_ALREADY_ASSIGNED);
      case '122':
        return this.throwError(OnboardErrCodes.beneficiary.MEED_CUSTID_INVALID);
      default:
        return this.throwError(INTERNAL_SERVER_ERROR);
    }
  }
}
