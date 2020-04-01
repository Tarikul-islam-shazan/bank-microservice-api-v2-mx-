import transformer from 'jsonata';
import {
  p2pPushMessageRequestTemplate,
  fundTransferRequestTemplate,
  debitSenderExternalRequest,
  p2pExternalTransferRequestTemplate,
  addIPayContactTemplate,
  creditReceiverRequest
} from './template';

class RequestMapper {
  static ipayContactMapper(data) {
    return transformer(addIPayContactTemplate).evaluate(data);
  }

  static pushApiBodyMapper(data) {
    return transformer(p2pPushMessageRequestTemplate).evaluate(data);
  }

  static fundTransferDataMapper(sender, receiver, transferData) {
    return transformer(fundTransferRequestTemplate).evaluate({
      sender,
      receiver,
      transferData
    });
  }

  static creditReceiverDataMapper(sender, receiver, transferData) {
    return transformer(creditReceiverRequest).evaluate({ sender, receiver, transferData });
  }

  static debitSenderReqBodyMapper(data) {
    return transformer(debitSenderExternalRequest).evaluate(data);
  }

  static externalTransferDataMapper(senderCustomerId, data) {
    return transformer(p2pExternalTransferRequestTemplate).evaluate({ senderCustomerId, ...data });
  }
}

export default RequestMapper;
