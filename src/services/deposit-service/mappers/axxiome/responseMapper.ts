import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../../utils/httpErrors';
import { DepositCheckResp, DepositMoneyResp } from '../../../models/deposit-service/interface';
import HttpStatus from 'http-status-codes';
export class AxxiomeResponseMapper {
  static depositFund(axxiomeResponse: object): any {
    try {
      const template = `{
        "message": 'Direct Deposit Mail sent successfully'
      }`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }

  static depositCheck(axxiomeResponse: object): DepositCheckResp {
    try {
      const template = `{
			'depositCheckConfirmationNumber': Data.TransactionId,
			'processingStatus': Data.ProcessingStatus = 'Passed' ? true : false
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }

  static depositMoney(axxiomeResponse: object): DepositMoneyResp {
    try {
      const template = `{
			'ProcessId': Data.Administrative.ProcessId
		}`;
      return jsonTransformer(template).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, '', 400);
    }
  }
}
