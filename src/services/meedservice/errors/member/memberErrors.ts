export const MemberErrorCodes = Object.freeze({
  INVALID_PARAMETER: {
    message: 'Invalid request parameter',
    errorCode: '1201',
    httpCode: 400
  },
  BANK_SERVICE_NOT_AVAILABLE: {
    message: 'Sorry! Our service is not currently available for country.',
    errorCode: '1202',
    httpCode: 400
  },
  MEMBER_NOT_FOUND: {
    message: 'Username or Password is not correct',
    errorCode: '1203',
    httpCode: 401
  },
  LANGUAGE_NOT_SUPPORTED: {
    message: 'Language not supported',
    errorCode: '1204',
    httpCode: 400
  },
  INVALID_INVITER: {
    message: 'Invalid inviter code or email',
    errorCode: '1205',
    httpCode: 400
  }
});
