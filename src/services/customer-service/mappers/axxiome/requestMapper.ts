import jsonTransformer from 'jsonata';
import {
  ICustomerService,
  EmailChangeReq,
  AddressChangeReq,
  ContactNumberChangeReq,
  NameChangeReq
} from '../../../models/customer-service/interface';
import { HTTPError } from '../../../../utils/httpErrors';
import HttpStatus from 'http-status-codes';

export class AxxiomeRequestDTO {
  static changeEmailReq(axxiomeResponse: object): EmailChangeReq {
    try {
      const template = `{
          "Data": {
          "Party": {
            "EmailAddress": $lowercase(email)
          }
        }
    }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeAddressReq(axxiomeResponse: object): AddressChangeReq {
    try {
      const template = `{
			"Data": {
				"Party": {
					"Address": {
						"AddressType": null,
						"AddressLine": [
							address
						],
						"PostCode": zipCode,
						"TownName": city,
						"CountrySubdivision": state,
						"Country": "US"
					}
				}
			}
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeContactNumberReq(axxiomeResponse: object): ContactNumberChangeReq {
    try {
      const template = `{
			"Data": {
				"Party": {
					"Phone": workPhone,
					"Mobile": mobilePhone
				}
			}
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeNameReq(axxiomeResponse: object): NameChangeReq {
    try {
      const template = `{
			"Data": {
				"Party": {
					"PartyType": "Sole",
					"Salutation": salutation,
					"FirstName": firstName,
					"MiddleName": middleName,
					"LastName": lastName,
					"DateOfBirth": dateOfBirth
				}
			}
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeContactPreferenceReq(axxiomeResponse: object): ContactNumberChangeReq {
    try {
      const template = `{
			"Data": {
				"Party": {
					"CommunicationPreference": [
						{
							"CommunicationType": $uppercase(type),
							"AdvertisingAllowed": status = true ? 'ON' : 'OFF'
						}
					]
        }
      }
    }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static urbarAirshipEmailChangeReq(axxiomeResponse: object): ContactNumberChangeReq {
    try {
      const template = `{
			"channel": {
        "type": "email",
        "address": email
      }
    }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }
}
