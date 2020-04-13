import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../../utils/httpErrors';
import HttpStatus from 'http-status-codes';
import { stateCitymunicipalityResponseTemplate } from './templates';

export class ResponseMapper {
  static applyForAccountIdentity(axxiomeResponse) {
    try {
      const template = `{
          "questions": [
            $.Data.KYC.IDA.Questions.{
              "id": Id,
              "question": Text,
              "availableAnswers": Answers.{
              "id": Id,
              "answer": Text
            }
          }
        ]
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static getIdentityQuestions(axxiomeResponse) {
    try {
      const template = `{
        "questions": [
          $.Data.KYC.IDA.Questions.{
            "id": Id,
            "question": Text,
            "availableAnswers": Answers.{
            "id": Id,
            "answer": Text
          }
          }
        ]
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static applyForAccountComplete(axxiomeResponse): { customerId: string } {
    try {
      const template = `{
        "customerId": Data.Party.PartyId
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static getTermsAndConditions(axxiomeResponse) {
    try {
      const template = `{
        "processId": Data.Administrative.ProcessId,
        "termsAndConditions": [Data.Documents.{
        "title": Name,
        "pdf": Content
        }]
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static acceptTermsAndCondition(axxiomeResponse) {
    try {
      const template = `{
        "accounts": [Data.Accounts.{
          'accountId': AccountId,
          "accountNumber": Account.Identification,
          "accountType": AccountType = 'CURRENT' ? 'DDA' : AccountType = 'SAVINGS' ? 'SSA' : 'LOC',
          'balanceOwed': null,
          'currentBalance': null,
          'holdBalance': 0,
          'availableBalance': 0,
          'minimumDue': 0,
          'status': null,
          "routingNumber": $substring(Account.SecondaryIdentification, 3),
          "isHold": AccountLocks[Code = 'MLACheck'] ? true : false
        }]
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static fundAccount(axxiomeResponse) {
    try {
      const template = `{
        "paymentTrackingID": Data.Administrative.ProcessId
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static stateCitymunicipality(invexResponse) {
    try {
      return jsonTransformer(stateCitymunicipalityResponseTemplate).evaluate(invexResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
