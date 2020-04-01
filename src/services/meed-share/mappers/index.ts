import jsonTransformer from 'jsonata';
import { IMeedShare } from '../../models/meed-share/interface';

export class ResponseMapper {
  static meedShare(response: IMeedShare): IMeedShare {
    const template = `{
      'lastMonthDistribution': lastMonthDistribution ? lastMonthDistribution : 0,
      'totalDistribution': totalDistribution ? totalDistribution : 0,
      'totalInvitees': totalInvitees ?  totalInvitees : 0
    }`;
    return jsonTransformer(template).evaluate(response);
  }
}
