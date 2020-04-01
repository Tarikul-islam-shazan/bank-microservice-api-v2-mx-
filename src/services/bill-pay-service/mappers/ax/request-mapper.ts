import jsonTransformer from 'jsonata';
import { addPayeeRequest, editPayeeRequest, createPaymentReq, editPaymentReq } from './templates';

export default class AxRequestMapper {
  static addPayee(data: any): any {
    return jsonTransformer(addPayeeRequest).evaluate(data);
  }

  static editPayee(data: any): any {
    return jsonTransformer(editPayeeRequest).evaluate(data);
  }

  static createPayment(data: any): any {
    return jsonTransformer(createPaymentReq).evaluate(data);
  }

  static editPayment(data: any): any {
    return jsonTransformer(editPaymentReq).evaluate(data);
  }
}
