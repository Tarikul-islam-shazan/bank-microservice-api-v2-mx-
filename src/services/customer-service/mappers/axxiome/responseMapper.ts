import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../../utils/httpErrors';
import { Customer, OtpResponse, ContactPreference } from '../../../models/customer-service/interface';
import HttpStatus from 'http-status-codes';
import { getPrivacyAndLegalRes } from './template';
export class AxxiomeResponseDTO {
  static getCustomerInfo(axxiomeResponse: object): Customer {
    try {
      const template = `{
        "nickname": nickname,
        "salutation": Data.Party.Salutation,
        "firstName": Data.Party.FirstName = 'string' ? '' : Data.Party.FirstName,
        "middleName": Data.Party.MiddleName = 'string' ? '' : Data.Party.MiddleName,
        "lastName": Data.Party.LastName = 'string' ? '' : Data.Party.LastName,
        "email": Data.Party.EmailAddress,
        "dateOfBirth": Data.Party.DateOfBirth,
        "address": Data.Party.Address.AddressLine[0],
        "city": Data.Party.Address.TownName,
        "state": Data.Party.Address.CountrySubdivision,
        "zipCode": Data.Party.Address.PostCode,
        "country": Data.Party.Address.Country,
        "mobilePhone": Data.Party.Mobile,
        "workPhone": Data.Party.Phone

      }`;

      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static getotpRequest(axxiomeResponse: object): OtpResponse {
    try {
      const template = `{
        "httpCode": httpCode,
        "code": code,
        "otpID": otpID,
        "message": message
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeEmailResponse(axxiomeResponse: object): Customer {
    try {
      const template = `{
        "email": Data.Party.EmailAddress
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeContactAddressResponse(axxiomeResponse: object): Customer {
    try {
      const template = `{
        "address": Data.Party.Address.AddressLine[0],
        "zipCode": Data.Party.Address.PostCode,
        "city": Data.Party.Address.TownName,
        "state": Data.Party.Address.CountrySubdivision
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeContactNuberResponse(axxiomeResponse: object): Customer {
    try {
      const template = `{
        "mobilePhone": Data.Party.Mobile,
        "workPhone": Data.Party.Phone
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeContactPreferenceResponse(axxiomeResponse: object): ContactPreference {
    try {
      const template = `{
        "status": Data.Party.CommunicationPreference.AdvertisingAllowed = 'ON' ? true : false,
        "type": $lowercase(Data.Party.CommunicationPreference.CommunicationType)
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static changeNickName(axxiomeResponse: object): Customer {
    try {
      const template = `{
        "nickname": nickname
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }

  static changeCustomerName(axxiomeResponse: object): Customer {
    try {
      const template = `{
        "salutation": Data.Party.Salutation,
        "firstName": Data.Party.FirstName,
        "middleName": Data.Party.MiddleName,
        "lastName": Data.Party.LastName,
        "dateOfBirth": Data.Party.DateOfBirth
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }

  static getContactPreferenceResponse(axxiomeResponse: object): ContactPreference {
    try {
      const template = `[ Data.Party.CommunicationPreference ].{
        'type': $lowercase(CommunicationType),
        'status': AdvertisingAllowed = 'ON' ? true : false
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static privacyAndLegalResponseMapper(response) {
    return jsonTransformer(getPrivacyAndLegalRes).evaluate(response.data);
  }
}
