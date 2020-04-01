import { AxErrorMapper } from '../../../utils/error-mapper/axError';
import { IError } from '../../../utils/error-mapper/errorMapper';

export const TransferErrorCodes = Object.freeze({
  immediateTransfer: {
    INSUFFICIENT_BALANCE: {
      message: 'Insufficient balance',
      errorCode: '801',
      httpCode: 400
    },
    DAILY_ACCESS_LIMIT_EXCEED: {
      message: 'Daily access limit exceed',
      errorCode: '802',
      httpCode: 400
    },
    WEEKLY_ACCESS_LIMIT_EXCEED: {
      message: 'Weekly access limit exceed',
      errorCode: '803',
      httpCode: 400
    },
    MONTHLY_ACCESS_LIMIT_EXCEED: {
      message: 'Monthly access limit exceed',
      errorCode: '804',
      httpCode: 400
    },
    DAILY_COUNTER_LIMIT_EXCEED: {
      message: 'Daily counter limit exceed',
      errorCode: '805',
      httpCode: 400
    },
    MONTHLY_COUNTER_LIMIT_EXCEED: {
      message: 'Monthly counter limit exceed',
      errorCode: '806',
      httpCode: 400
    }
  },
  CANNOT_BE_MODIFIED: {
    message: 'Immediate Transfers cannot be modified',
    errorCode: '807',
    httpCode: 403
  }
});

export class TransferErr extends AxErrorMapper {
  /**
   * @static
   * @param {number} code
   * @param {*} data
   * @returns {IError}
   * @memberof AxErrorMapper
   */
  static immediateTransferError(err: any): IError {
    const code = this.getHttpCode(err);
    const message = this.getMessage(err);
    let errorCode = '';

    if (
      err.response &&
      err.response.data.Data &&
      err.response.data.Data.Error &&
      err.response.data.Data.Error.length > 0 &&
      err.response.data.Data.Error[0].ErrorCode
    ) {
      errorCode = err.response.data.Data.Error[0].ErrorCode;
    } else {
      errorCode = this.getErrCode(message);
    }

    switch (errorCode) {
      case 'insufficientBalance':
        return TransferErrorCodes.immediateTransfer.INSUFFICIENT_BALANCE;
      case 'dailyAccessLimitExceed':
        return TransferErrorCodes.immediateTransfer.DAILY_ACCESS_LIMIT_EXCEED;
      case 'weeklyAccessLimitExceed':
        return TransferErrorCodes.immediateTransfer.WEEKLY_ACCESS_LIMIT_EXCEED;
      case 'monthlyAccessLimitExceed':
        return TransferErrorCodes.immediateTransfer.MONTHLY_ACCESS_LIMIT_EXCEED;
      case 'dailyCounterLimitExceed':
        return TransferErrorCodes.immediateTransfer.DAILY_COUNTER_LIMIT_EXCEED;
      case 'monthlyCounterLimitExceed':
        return TransferErrorCodes.immediateTransfer.MONTHLY_COUNTER_LIMIT_EXCEED;
      default:
        return this.getMappedError(code, message);
    }
  }

  /**
   * @private
   * @static
   * @param {string} errMsg
   * @returns {string}
   * @memberof AxErrorMapper
   */
  private static getErrCode(errMsg: string): string {
    if (errMsg.includes('Overdraft')) {
      // example message: 'W-025-BCA_AVLB_AMNT:Overdraft of 1,00 USD; Available 0,00 USD'
      // const msg = errMsg.match(/(\d+,\d+\s\w.[usd|USD])/gim); // TODO: we can extract the amounts and modify message?
      return 'insufficientBalance';
    }
    return '';
  }
}
