export const BankAuthCodes = Object.freeze({
  UNABLE_GET_ACCESS_TOKEN: {
    message: 'Unable to get access token',
    errorCode: '301',
    httpCode: 500
  },
  HEADERS_NOT_SET: {
    message: 'Headers must be set before accessing them',
    errorCode: '302',
    httpCode: 411
  }
});
