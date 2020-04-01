export abstract class HTTPClientError extends Error {
  statusCode!: number;
  errors: any;

  constructor(code: string, message: object | string) {
    if (message instanceof Object) {
      super(JSON.stringify(message));
    } else {
      super(message);
    }
    this.errors = { code, message };
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTP404Error extends HTTPClientError {
  readonly statusCode = 404;

  constructor(message: string | object = 'Not found', errorCode: string = '4004') {
    super(errorCode, message);
  }
}

export class HTTPError extends HTTPClientError {
  /**
   * Creates an instance of HTTPError.
   *
   * @param {(string | object)} [message='Internal Server Error'] Error message
   * @param {string} [errorCode='99'] Custom error code
   * @param {number} [statusCode=500] Standard HTTP code
   * @memberof HTTPError
   * @constructor
   */
  constructor(
    message: string | object = 'Internal Server Error',
    errorCode: string = '5000',
    statusCode: number = 500
  ) {
    super(errorCode, message);
    this.statusCode = statusCode;
  }
}
