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
  general: {
    CLIENT_ALREADY_EXISTS: {
      message: 'Client already exists',
      errorCode: '604',
      httpCode: 409
    },
    CUSTOMER_ALREADY_ASSIGNED: {
      message: 'Customer has already been assigned',
      errorCode: '605',
      httpCode: 409
    },
    REG_TYPE_INVALID: {
      message: 'The registration type is a not valid',
      errorCode: '606',
      httpCode: 400
    },
    PERSON_TYPE_INVALID: {
      message: 'The type of person does not correspond',
      errorCode: '607',
      httpCode: 400
    },
    CURP_LENGTH_INVALID: {
      message: 'The length of CURP is wrong',
      errorCode: '608',
      httpCode: 400
    },
    CUSTOMERID_LENGTH_INVALID: {
      message: 'The length in the customerId is incorrect',
      errorCode: '609',
      httpCode: 400
    },
    TAX_PAYER_ID_ASSIGNED: {
      message: 'The customer with Tax Payer ID ( XXXXXX ) has been already assigned the CustID (XXXX)',
      errorCode: '610',
      httpCode: 409
    },
    MEED_ID_REQUIRED: {
      message: 'The Meed ID is a required value',
      errorCode: '611',
      httpCode: 400
    },
    MEED_ID_NOT_FOUND: {
      message: 'The Meed ID does not exist',
      errorCode: '612',
      httpCode: 400
    },
    MEED_ID_ALREADY_ASSIGNED: {
      message: 'The MeedID has already been assigned to another customer',
      errorCode: '613',
      httpCode: 409
    }
  },
  addressInfo: {
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

  static generalInfo(response: InvexResponseData): InvexResponse[] {
    this.checkSuccess(response);

    switch (response.busqueda[0]?.respcode) {
      case '000':
        return response.busqueda;
      case '106':
        return this.throwError(OnboardErrCodes.general.CLIENT_ALREADY_EXISTS);
      case '118':
        return this.throwError(OnboardErrCodes.general.CUSTOMER_ALREADY_ASSIGNED);
      case '120':
        return this.throwError(OnboardErrCodes.general.REG_TYPE_INVALID);
      case '124':
        return this.throwError(OnboardErrCodes.general.PERSON_TYPE_INVALID);
      case '129':
        return this.throwError(OnboardErrCodes.general.CURP_LENGTH_INVALID);
      case '132':
        return this.throwError(OnboardErrCodes.general.TAX_PAYER_ID_ASSIGNED);
      case '134':
        return this.throwError(OnboardErrCodes.general.CUSTOMERID_LENGTH_INVALID);
      case '121':
        return this.throwError(OnboardErrCodes.general.MEED_ID_REQUIRED);
      case '122':
        return this.throwError(OnboardErrCodes.general.MEED_ID_NOT_FOUND);
      case '133':
        return this.throwError(OnboardErrCodes.general.MEED_ID_ALREADY_ASSIGNED);
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
