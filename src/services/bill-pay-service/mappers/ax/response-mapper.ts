import jsonTransformer from 'jsonata';
import { addPayeeResponse } from './templates';

export default class AxResponseMapper {
  static payeeDetails(data: any): any {
    return jsonTransformer(addPayeeResponse).evaluate(data);
  }

  static getPayeeList(data: any): any {
    const template = `
		[Data.BillPayees.{
			"payeeId": $string(Payee.PayeeId),
			"fullName": Payee.FullName,
			"nickName": Payee.Nickname,
      "phone": Payee.Phone,
      "paymentMethodType": PayeeDetails.PaymentMethodType,
      "firstAvailableProcessDate": PayeeDetails.FirstAvailableProcessDate
		}]`;
    return jsonTransformer(template).evaluate(data);
  }

  static paymentDetails(data: any): any {
    const template = `{
      "paymentId": Data.BillPayment.PaymentId,
      "payeeId": Data.BillPayment.CreditorAccount.Identification,
			"amount":  $number(Data.BillPayment.InstructedAmount.Amount),
			"currency":  Data.BillPayment.InstructedAmount.Currency,
			"executionDate": Data.BillPayment.RequestedExecutionDateTime
    }`;
    return jsonTransformer(template).evaluate(data);
  }

  static getPayments(data: any): any {
    const template = `[$.Data.BillPayments.{
      "paymentId": PaymentId,
      "payeeId": CreditorAccount.Identification,
      "amount": $number(InstructedAmount.Amount),
      "currency": InstructedAmount.Currency,
      "executionDate": RequestedExecutionDateTime,
      "frequency": RecurringPaymentInformation.Frequency ? RecurringPaymentInformation.Frequency : '',
      "recurringPaymentDate": RecurringPaymentInformation.RecurringPaymentDateTime
    }]`;
    return jsonTransformer(template).evaluate(data);
  }
}
