import jsonTransformer from 'jsonata';

import {
  immediateTransferTemplate,
  scheduleTransferTemplate,
  recurringScheduleTransferTemplate
} from './request-template';
import { ITransfer } from '../../../models/internal-transfer/interface';

export class RequestMapper {
  static immediateTransfer(transfer: ITransfer): any {
    return jsonTransformer(immediateTransferTemplate).evaluate(transfer);
  }

  static scheduleTransfer(transfer: ITransfer): any {
    return jsonTransformer(scheduleTransferTemplate).evaluate(transfer);
  }

  static recurringScheduleTransfer(transfer: ITransfer): any {
    return jsonTransformer(recurringScheduleTransferTemplate).evaluate(transfer);
  }
}
