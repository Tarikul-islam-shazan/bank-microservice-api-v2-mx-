/**
 *  This is the global mock for actual axios node module.
 *  Can be use in test files as below:
 *      jest.mock('axios');
 *      import axios from 'axios';
 *
 *  Jest will automatically detect this file and mock the axios.
 *  TO replace expected value:
 *      (axios.create().post as jest.Mock).mockResolvedValue(expectedResponse);
 *      (axios.get as jest.Mock).mockResolvedValue(expectedResponse);
 *
 */

const defaultMockResponse = {
  data: 'Default axios mock response',
  status: 200,
  statusText: 'OK',
  headers: {
    'access-control-allow-credentials': true,
    'access-control-expose-headers':
      'MeedBankingClub-Bank-Identifier,MeedBankingClub-Correlation-Id,MeedbankingClub-Billpay-Provider',
    'content-type': 'application/json; charset=utf-8'
  },
  config: {},
  request: {}
};

const axiosMockMethods = {};
['get', 'delete', 'head', 'options', 'post', 'put', 'patch'].forEach(httpMethod => {
  axiosMockMethods[httpMethod] = jest.fn().mockResolvedValue(defaultMockResponse);
});

const interceptorMock = {
  use: jest.fn().mockReturnValue(1),
  eject: jest.fn()
};

const axiosInstanceMock = {
  ...axiosMockMethods,
  getUri: jest.fn().mockReturnValue('mock.url.com'),
  request: jest.fn().mockResolvedValue(defaultMockResponse),
  interceptors: {
    request: interceptorMock,
    response: interceptorMock
  }
};

const axiosMock = {
  create: jest.fn().mockReturnValue(axiosInstanceMock),
  ...axiosInstanceMock
};

const defaultMockError = {
  code: '500',
  response: {
    ...defaultMockResponse,
    status: 500,
    statusText: 'Internal Server Error'
  },
  isAxiosError: false
};

export default axiosMock;
export { axiosInstanceMock, defaultMockResponse, defaultMockError };
