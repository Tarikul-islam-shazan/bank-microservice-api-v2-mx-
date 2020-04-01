import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../../utils/httpErrors';
import HttpStatus from 'http-status-codes';
import { RegistrationFeePaymentType } from '../../../models/bank-onboarding/interface';

export class AxxiomeRequestMapper {
  static depositMoneyReq(axxiomeResponse: object): any {
    try {
      const template = `{
			"Data": {
				"Funding": {
					"InstructionIdentification": "",
					"EndToEndIdentification": paymentTrackingID,
					"LocalInstrument": paymentMethod = "${RegistrationFeePaymentType.ACH}" or paymentMethod = "${RegistrationFeePaymentType.ECHECK}"  ? "ACH" : paymentMethod = "${RegistrationFeePaymentType.CREDITCARD}" or paymentMethod = "${RegistrationFeePaymentType.DEBITCARD}" ? "Card",
					"InstructedAmount": {
						"Value": $number(totalAmount),
						"Currency": currency
					},
					"CreditorAccount": [
						checkingAmount ? {
							"SchemeName": "MEED.AccountNumber",
							"Identification": "DDA",
							"InstructedAmount": {
								"Value": checkingAmount,
								"Currency": currency
							}
						},
						savingAmount ? {
							"SchemeName": "MEED.AccountNumber",
							"Identification": "SAV",
							"InstructedAmount": {
								"Value": savingAmount,
								"Currency": currency
							}
						}
					],
					"DebtorParty": {},
					"DebtorAccount": {}
				}
			}
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static depositCheckReq(axxiomeResponse: object): any {
    try {
      const template = `{
			"Data": {
				"Initiation": {
					"InstructedAmount": {
						"Amount": amount,
						"Currency": currency
					},
					"CreditorAccount": {
						"SchemeName": "AXXD.AccountNumber",
						"Identification": identification,
						"Name": null,
						"SecondaryIdentification": secondaryIdentification
					},
					"DebtorAccount": {
						"MICR": null,
						"ChequeNumber": null,
						"BankName": null,
						"SchemeName": null,
						"Identification": null,
						"Name": null,
						"SecondaryIdentification": null
					},
					"SupplementaryData": {
						"ChequeImage": {
							"FrontImage": '',
							"BackImage": ''
						},
						"DeviceInformation": {
							"DeviceKey": deviceKey,
							"DeviceDescription": deviceDescription
						}
					}
				}
			}
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
