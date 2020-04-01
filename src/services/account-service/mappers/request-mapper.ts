import jsonTransformer from 'jsonata';
import { transactionSearchQueries } from './templates';
import { ITransactionQueries } from '../../models/account-service/interface';

class RequestMapper {
  static getAccountDetails(requestParams) {
    // TODO: Have to work
  }

  static transactionQueries(queries: object): any {
    return jsonTransformer(transactionSearchQueries).evaluate(queries);
  }
}

export default RequestMapper;
