export const AuthErrorCodes = Object.freeze({
  AUTH_TOKEN_MISSING: {
    message: 'Authentication token missing',
    errorCode: '1501',
    httpCode: 403
  },
  AUTH_TOKEN_INVALID: {
    message: 'Authentication token invalid or expired',
    errorCode: '1502',
    httpCode: 400
  },
  NOT_AUTHENTICATED: {
    message: 'You are not authenticated',
    errorCode: '1503',
    httpCode: 401
  }
});
