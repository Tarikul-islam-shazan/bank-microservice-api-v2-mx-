import jsonTransformer from 'jsonata';
import HttpStatus from 'http-status-codes';

import { HTTPError } from '../../../utils/httpErrors';
import { pushInAppMessageReq, pushMessageReq, customEventReq } from './templates';
import { IUASPushMessage, IUASCustomEvent } from '../../models/urban-airship/interface';

export class UASRequestMapper {
  static pushInAppMessage(data: IUASPushMessage) {
    try {
      return jsonTransformer(pushInAppMessageReq).evaluate(data);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static pushTemplateMessage(data: IUASPushMessage) {
    try {
      return jsonTransformer(pushMessageReq).evaluate(data);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static customEvent(data: IUASCustomEvent) {
    try {
      return jsonTransformer(customEventReq).evaluate(data);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
