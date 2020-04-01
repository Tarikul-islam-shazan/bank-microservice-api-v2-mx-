import transformer from 'jsonata';
import {
  creditReceiverResponse,
  p2pExternalTransferResponseTemplate,
  iPayContactResponseTemplate,
  iPayContactsMapperTemplate,
  fundTransferResponseTemplate
} from './template';

class ResponseMapper {
  static iPayContactsMapper(response) {
    return transformer(iPayContactsMapperTemplate).evaluate(response.data);
  }

  static fundTransferResponseMapper(response) {
    return transformer(fundTransferResponseTemplate).evaluate(response.data);
  }

  static creditReceiverResponseMapper(response) {
    return transformer(creditReceiverResponse).evaluate(response.data);
  }

  static externalTransferResponseMapper(response) {
    return transformer(p2pExternalTransferResponseTemplate).evaluate(response.data);
  }

  static iPayContactResponseMapper(response) {
    return transformer(iPayContactResponseTemplate).evaluate(response.data);
  }
}

export default ResponseMapper;
