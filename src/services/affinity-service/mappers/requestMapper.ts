import jsonTransformer from 'jsonata';
import { IAffinityAuthCredential } from '../../models/affinity-service/interface';
import { HTTPError } from '../../../utils/httpErrors';
import HttpStatus from 'http-status-codes';

export default class RequestMapper {
  static mapRegisterAffinityUser(requestBody: IAffinityAuthCredential) {
    try {
      const meedExtraRegistrationReq = `{
			"first_name": firstName,
			"last_name": lastName,
			"username": username,
			"email": email,
			"confirm_email": email,
			"password": "Meed#1" & uniqueId,
			"confirm_password": "Meed#1" & uniqueId,
			"state": state,
			"zip": zipCode,
			"opted_in": "f"
		}`;
      return jsonTransformer(meedExtraRegistrationReq).evaluate(requestBody);
    } catch (error) {
      throw new HTTPError(error.message, String(HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
    }
  }
}
