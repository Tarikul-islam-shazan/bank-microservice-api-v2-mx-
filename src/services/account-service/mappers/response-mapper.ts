import jsonTransformer from 'jsonata';
import { accountSummary, transactions, statements, monthlyStatements, getSweepStateResponse } from './templates';
import { ITransaction, ISweepState } from '../../models/account-service/interface';

class ResponseMapper {
  // filter bank account info response data
  static accountSummaryMapper(response: any) {
    // filter based on template
    return jsonTransformer(accountSummary).evaluate(response.data);
  }

  static transactionsDetailsMapper(response: any): ITransaction[] {
    return jsonTransformer(transactions).evaluate(response.data);
  }

  static statementsMapper(response: any): any {
    return jsonTransformer(statements).evaluate(response.data);
  }

  static statementDetailsMapper(response: any): any {
    return jsonTransformer(monthlyStatements).evaluate(response.data);
  }

  static sweepStateMapper(response: any): ISweepState {
    return jsonTransformer(getSweepStateResponse).evaluate(response.data);
  }
}

export default ResponseMapper;
