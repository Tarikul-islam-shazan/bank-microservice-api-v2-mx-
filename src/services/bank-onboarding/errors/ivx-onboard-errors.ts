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
  },
  personal: {
    MEEDID_NOT_RELATED: {
      message: 'Meed Id has NOT been customer related',
      errorCode: '627',
      httpCode: 400
    },
    GENDER_INCORRECT: {
      message: 'The value for Gender is incorrect',
      errorCode: '628',
      httpCode: 400
    },
    BIRTH_COUNTRY_INCORRECT: {
      message: 'The value for Country of Birth is incorrect',
      errorCode: '629',
      httpCode: 400
    },
    NATIONALITY_INCORRECT: {
      message: 'The value for Nationality is incorrect',
      errorCode: '630',
      httpCode: 400
    },
    STATE_INCORRECT: {
      message: 'The value for Place (State) of Birth is incorrect',
      errorCode: '631',
      httpCode: 400
    },
    MARITAL_STATUS_INCORRECT: {
      message: 'The value for Marital Status is incorrect',
      errorCode: '632',
      httpCode: 400
    },
    PROFESSION_INCORRECT: {
      message: 'The value for Profession is incorrect',
      errorCode: '633',
      httpCode: 400
    },
    OCCUPATION_INCORRECT: {
      message: 'The value for Occupation is incorrect',
      errorCode: '634',
      httpCode: 400
    },
    ECONOMIC_ACTIVITY_INCORRECT: {
      message: 'The value for Economic Activity is incorrect',
      errorCode: '635',
      httpCode: 400
    },
    EDUCATIONAL_LEVEL_INCORRECT: {
      message: 'The value for Educational Level is incorrect',
      errorCode: '636',
      httpCode: 400
    },
    BANXICO_ACTIVITY_INCORRECT: {
      message: 'The value for Banxico Activity is incorrect',
      errorCode: '637',
      httpCode: 400
    },
    CLIENT_ALREADY_EXISTS: {
      message: 'Client Already Exists',
      errorCode: '624',
      httpCode: 409
    },
    MEED_ID_NOT_FOUND: {
      message: 'The Meed ID does not exist',
      errorCode: '612',
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

  static stateCityMunicipality(response: InvexResponseData): InvexResponse | InvexResponse[] {
    // will throw error if 'codRet' is not success i,e '000'
    this.checkSuccess(response);

    switch (response.busqueda[0]?.respcode) {
      case '000':
        return response.busqueda as InvexResponse[];
      case '100':
        return this.throwError(OnboardErrCodes.addressInfo.POST_CODE_NOT_EXISTS);
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

  static addressInfo(response: InvexResponseData): InvexResponse | InvexResponse[] {
    // will throw error if 'codRet' is not success i,e '000'
    this.checkSuccess(response);

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

  static personalInfo(response: InvexResponseData): InvexResponse[] {
    this.checkSuccess(response);
    switch (response.busqueda[0]?.respcode) {
      case '000':
        return response.busqueda as InvexResponse[];
      case '135':
        return this.throwError(OnboardErrCodes.personal.MEEDID_NOT_RELATED);
      case '137':
        return this.throwError(OnboardErrCodes.personal.GENDER_INCORRECT);
      case '139':
        return this.throwError(OnboardErrCodes.personal.BIRTH_COUNTRY_INCORRECT);
      case '141':
        return this.throwError(OnboardErrCodes.personal.NATIONALITY_INCORRECT);
      case '143':
        return this.throwError(OnboardErrCodes.personal.STATE_INCORRECT);
      case '145':
        return this.throwError(OnboardErrCodes.personal.MARITAL_STATUS_INCORRECT);
      case '147':
        return this.throwError(OnboardErrCodes.personal.PROFESSION_INCORRECT);
      case '149':
        return this.throwError(OnboardErrCodes.personal.OCCUPATION_INCORRECT);
      case '153':
        return this.throwError(OnboardErrCodes.personal.EDUCATIONAL_LEVEL_INCORRECT);
      case '155':
        return this.throwError(OnboardErrCodes.personal.BANXICO_ACTIVITY_INCORRECT);
      case '106':
        return this.throwError(OnboardErrCodes.personal.CLIENT_ALREADY_EXISTS);
      case '122':
        return this.throwError(OnboardErrCodes.personal.MEED_ID_NOT_FOUND);
      default:
        return this.throwError(INTERNAL_SERVER_ERROR);
    }
  }
}
