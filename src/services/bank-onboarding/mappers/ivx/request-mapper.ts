import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../../utils/httpErrors';
import {
  Credential,
  IdentityAnswers,
  RegistrationFeeRequest,
  IScannedIdData,
  MxMemberInfo,
  RegistrationFeePaymentType,
  IAddressInfo,
  IFundProvider
} from '../../../models/bank-onboarding/interface';
import HttpStatus from 'http-status-codes';
import {
  signUpRequestTemplate,
  ScannedIdDataTemplate,
  identityAnswer,
  productOnboarding,
  addressInfoTemplate,
  beneficiaryInfoTempl,
  generalInfoTemplate,
  stateCityMunicipality,
  personalInfoTemplate,
  fundProviderRequestTemplate
} from './templates';

export class RequestMapper {
  static createLogin(customerId: string, requestBody: Credential) {
    try {
      const template = `{
        "metodoNombre": "MTD129",
        "metodopEntrada": [
          {
            "llave": "string",
            "valor": "${customerId}"
          },
          {
            "llave": "string",
            "valor": username
          },
          {
            "llave": "string",
            "valor": password
          }
        ]
      }`;
      return jsonTransformer(template).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Take member application data, scanned Id data and convert it to a Axxiome request body
   *
   * @static
   * @param {USMemberInfo} memberInfo
   * @param {IScannedIdData} scannedIdData
   * @memberof RequestMapper
   */
  static applyForAccount(memberInfo: MxMemberInfo, scannedIdData: IScannedIdData) {
    try {
      const requestBody = jsonTransformer(signUpRequestTemplate).evaluate(memberInfo);
      requestBody.Data.KYC = jsonTransformer(ScannedIdDataTemplate).evaluate(scannedIdData);
      return requestBody;
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static startProductOnboarding(customerId: string, promotionCode: string) {
    try {
      return jsonTransformer(productOnboarding).evaluate({ customerId, promotionCode });
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static setIdentityQuestionsAnswers(requestBody: IdentityAnswers) {
    try {
      return jsonTransformer(identityAnswer).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static acceptTermsAndConditions(isTermsAccepted: boolean, processId: string) {
    try {
      const apiBody = {
        Data: {
          AllDocumentsAccepted: true,
          Documents: [],
          Administrative: {
            ProcessId: processId
          }
        }
      };
      return apiBody;
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static fundAccount(requestBody: RegistrationFeeRequest) {
    try {
      const template = `{
        "Data": {
          "Funding": {
            "InstructionIdentification": "",
            "EndToEndIdentification": paymentTrackingId,
            "LocalInstrument": paymentMethod = "${RegistrationFeePaymentType.ACH}" or paymentMethod = "${RegistrationFeePaymentType.ECHECK}"  ? "ACH" : paymentMethod = "${RegistrationFeePaymentType.CREDITCARD}" or paymentMethod = "${RegistrationFeePaymentType.DEBITCARD}" ? "Card",
            "InstructedAmount": {
              "Value": $number(totalAmount),
              "Currency": currency
            },
            "CreditorAccount": [
              deposits[accountType='DDA'].amount?{
                "SchemeName": "MEED.AccountNumber",
                "Identification": "DDA",
                "InstructedAmount": {
                  "Value": deposits[accountType='DDA'].amount,
                  "Currency": currency
                }
              },
              deposits[accountType='SSA'].amount?{
                "SchemeName": "MEED.AccountNumber",
                "Identification": "SAV",
                "InstructedAmount": {
                  "Value": deposits[accountType='SSA'].amount,
                  "Currency": currency
                }
              }
            ],
            "DebtorParty": {},
            "DebtorAccount": {}
          }
        }
      }`;
      return jsonTransformer(template).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static addressInfo(customerId: string, requestBody: IAddressInfo) {
    try {
      return jsonTransformer(addressInfoTemplate).evaluate({ customerId, ...requestBody });
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static generalInfo(requestBody: any) {
    try {
      return jsonTransformer(generalInfoTemplate).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static stateCityMunicipality(postCode: Partial<IAddressInfo>) {
    try {
      return jsonTransformer(stateCityMunicipality).evaluate(postCode);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static beneficiaryInfo(requestBody: any) {
    try {
      return jsonTransformer(beneficiaryInfoTempl).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static fundProvider(customerId: string, funding: IFundProvider) {
    try {
      return jsonTransformer(fundProviderRequestTemplate).evaluate({ customerId, ...funding?.providerInfo });
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
                                                                    
  static personalInfo(requestBody: any) {
    try {
      return jsonTransformer(personalInfoTemplate).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
