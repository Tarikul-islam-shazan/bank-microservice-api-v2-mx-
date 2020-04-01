import { AxErrorMapper } from '../../../utils/error-mapper/axError';

export const AxErrorCodes = Object.freeze({});

export class AxDepositErrMapper extends AxErrorMapper {
  static depositFundResponse(err: any): any {
    const httpCode = this.getHttpCode(err);
    switch (httpCode) {
      default:
        return this.getMappedError(httpCode, this.getMessage(err));
    }
  }
}
