import transformer from 'jsonata';
import { jumioVerificationReq } from './templates';
class RequestMapper {
  static jumioDataMapper(jumioVerificationData): any {
    return transformer(jumioVerificationReq).evaluate(jumioVerificationData);
  }
}

export default RequestMapper;
