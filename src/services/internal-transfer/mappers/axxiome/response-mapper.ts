import jsonTransformer from 'jsonata';
import { getScheduledTransfersTemplate, getRecurringScheduledTransfersTemplate } from './response-template';

export class ResponseMapper {
  static immediateTransfer(responseBody: object) {
    const template = `{
      'transferConfirmationNumber': Data.DomesticPaymentId
    }`;
    return jsonTransformer(template).evaluate(responseBody);
  }

  static scheduleTransfer(responseBody: object) {
    const template = `{
      'transferConfirmationNumber': Data.DomesticScheduledPaymentId
    }`;
    return jsonTransformer(template).evaluate(responseBody);
  }

  static recurringScheduleTransfer(responseBody: object) {
    const template = `{
      'transferConfirmationNumber': Data.DomesticStandingOrderId
    }`;
    return jsonTransformer(template).evaluate(responseBody);
  }

  static getScheduledTransfers(responseBody: any) {
    return jsonTransformer(getScheduledTransfersTemplate).evaluate(responseBody);
  }

  static getRecurringScheduledTransfers(responseBody: any) {
    return jsonTransformer(getRecurringScheduledTransfersTemplate).evaluate(responseBody);
  }
}
