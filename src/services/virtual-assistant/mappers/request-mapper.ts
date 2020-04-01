import jsonTransformer from 'jsonata';
import { IChatSession } from '../../models/virtual-assistant/interface';

export class VARequestMapper {
  static sessionPostData(request: IChatSession, chatQueueList: any, liveChatCustomerID: any, endUserId: number) {
    const template = `{
      "firstName": firstName,
      "lastName": lastName,
      "userName": "${request.firstName + ' ' + request.lastName}",
      "emailId": email,
      "queueId": ${chatQueueList.queueId},
      "queueName": "${chatQueueList.queueName}",
      "customData": '{}',
      "customerId": ${liveChatCustomerID},
      "ip": '',
      "city": '',
      "region": '',
      "country": '',
      "org": '',
      "os": '',
      "browser": '',
      "mobile": false,
      "timeZone": timeZone,
      "userLocalTime": userLocalTime,
      "contextQueueId": '1',
      "isPriority": false,
      "endUserId": ${endUserId},
      "originId": 1,
      "userSessionId": '',
      "vaSessionId": ident
    }`;
    return jsonTransformer(template).evaluate(request);
  }

  static localUserData(request: IChatSession, liveChatCustomerID: any) {
    const template = `{
      "customerId": ${liveChatCustomerID},
      "emailId": email,
      "firstName": firstName,
      "isDeleted": 0,
      "isPriority": 0,
      "lastName": lastName,
      "mobileNumber": '',
      "systemUserId": ''
    }`;
    return jsonTransformer(template).evaluate(request);
  }
}
