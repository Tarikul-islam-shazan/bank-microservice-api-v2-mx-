import { ITransfer, TransferType, TransferFrequency } from '../../models/internal-transfer/interface';

import moment = require('moment');
import { IAccount } from '../../models/account-service/interface';

export class TransferUtil {
  constructor() {}

  /**
   *  Determines the type of transfer. Used mostly in the creation of a new transfer
   * since for already created transfer types, we will be returning the transfer type.
   *
   * @static
   * @param {ITransfer} transfer
   * @returns {TransferType}
   * @memberof TransferService
   */
  public static getTransferType(transfer: ITransfer): TransferType {
    const requestTimeOffset = moment.parseZone(transfer.transferDate).utcOffset();
    const todayAtClientLocation = moment()
      .utcOffset(requestTimeOffset)
      .format('YYYY-MM-DD');
    transfer.transferDate = moment(transfer.transferDate)
      .utcOffset(requestTimeOffset)
      .format('YYYY-MM-DD');
    const today = new Date(todayAtClientLocation);
    const scheduledDate = new Date(transfer.transferDate);
    const type =
      transfer.frequency === TransferFrequency.Once
        ? scheduledDate.getTime() <= today.getTime()
          ? TransferType.Immediate
          : TransferType.Scheduled
        : TransferType.Recurring;

    return type;
  }

  /**
   * @static
   * @param {ITransfer[]} tansferList
   * @param {IAccount[]} accounts
   * @returns {ITransfer[]}
   * @memberof TransferUtil
   */
  public static sortTransfersByDate(tansferList: ITransfer[], accounts: IAccount[]): ITransfer[] {
    const creditorAccounts = new Map();

    accounts.forEach((account: IAccount) => {
      creditorAccounts.set(account.accountNumber, { ...account });
    });

    const result = tansferList
      .map((transaction: ITransfer) => {
        transaction.creditorAccount = creditorAccounts.get(transaction.creditorAccount).accountId;
        transaction.debtorAccount =
          creditorAccounts.get(transaction.debtorAccount)?.accountId || transaction.debtorAccount;
        return transaction;
      })
      .sort((a: ITransfer, b: ITransfer) => new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime());

    return result;
  }
}
