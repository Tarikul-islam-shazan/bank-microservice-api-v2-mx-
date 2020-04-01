import jsonTransformer from 'jsonata';
import { HTTPError } from '../../../utils/httpErrors';
import HttpStatus from 'http-status-codes';
import { emailLookupRes } from './templates';

export class UrbanAirshipResponseMappers {
  static uasNamedUserLookup(axxiomeResponse: object) {
    try {
      const responseTemplate = `{
        "tags": named_user.tags.meed_opt_in,
        "channelId": named_user and named_user.channels ? named_user.channels[device_type = 'email'].channel_id : ''
      }`;
      return jsonTransformer(responseTemplate).evaluate(axxiomeResponse);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }

  static emailLookup(data: object) {
    try {
      return jsonTransformer(emailLookupRes).evaluate(data);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
