import { ITransferStrategy, ITransfer, IBankService, TransferType } from '../../models/internal-transfer/interface';
import { IAuthorization } from '../../bank-auth/models/interface';
import { RequestMapper, ResponseMapper } from '../mappers';
import { MeedAxios } from '../../../utils/api';
import { TransferErr, TransferErrorCodes } from '../errors/index';
import { HTTPError } from '../../../utils/httpErrors';
import HttpStatus from 'http-status-codes';
import { inject, named, injectable } from 'inversify';
import { TYPES } from '../../../utils/ioc/types';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import config from '../../../config/config';

@injectable()
export abstract class TransferStrategy implements IBankService {
  protected auth: IAuthorization;

  constructor(injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }
}

@injectable()
export class ImmediateTransferStrategy extends TransferStrategy implements ITransferStrategy {
  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  public async transfer(transfer: ITransfer): Promise<any> {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.immediateTransfer(transfer);
      const transferRes = await MeedAxios.getAxiosInstance().post(
        `/payment/${config.api.axxiome.version}/domestic-payment`,
        { ...apiBody },
        headers
      );
      transfer.transferId = ResponseMapper.immediateTransfer(transferRes.data).transferConfirmationNumber;
      transfer.transferType = TransferType.Immediate;
      return transfer;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.immediateTransferError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async getTransfers(): Promise<ITransfer[]> {
    throw new HTTPError(
      HttpStatus.getStatusText(HttpStatus.NOT_IMPLEMENTED),
      String(HttpStatus.NOT_IMPLEMENTED),
      HttpStatus.NOT_IMPLEMENTED
    );
  }

  public async modifyTransfer(transfer: ITransfer): Promise<ITransfer> {
    const { message, errorCode, httpCode } = TransferErrorCodes.CANNOT_BE_MODIFIED;
    throw new HTTPError(message, errorCode, httpCode);
  }

  public async deleteTransfer(transferId: string): Promise<boolean> {
    const { message, errorCode, httpCode } = TransferErrorCodes.CANNOT_BE_MODIFIED;
    throw new HTTPError(message, errorCode, httpCode);
  }
}

@injectable()
export class ScheduledTransferStrategy extends TransferStrategy implements ITransferStrategy {
  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }
  public async transfer(transfer: ITransfer): Promise<any> {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.scheduleTransfer(transfer);
      const transferRes = await MeedAxios.getAxiosInstance().post(
        `/domesticScheduledPayment/${config.api.axxiome.version}/domestic-scheduled-payments`,
        { ...apiBody },
        headers
      );
      transfer.transferId = ResponseMapper.scheduleTransfer(transferRes.data).transferConfirmationNumber;
      transfer.transferType = TransferType.Scheduled;
      return transfer;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async getTransfers(): Promise<ITransfer[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const transferRes = await MeedAxios.getAxiosInstance().get(
        `domesticScheduledPayment/${config.api.axxiome.version}/domestic-scheduled-payments`,
        headers
      );
      const scheduleTransfers: ITransfer[] = ResponseMapper.getScheduledTransfers(transferRes.data);
      return scheduleTransfers;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async modifyTransfer(transfer: ITransfer): Promise<ITransfer> {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.scheduleTransfer(transfer);
      const transferRes = await MeedAxios.getAxiosInstance().put(
        `domesticScheduledPayment/${config.api.axxiome.version}/domestic-scheduled-payments/${transfer.transferId}`,
        { ...apiBody },
        headers
      );
      const confirmationNumber = ResponseMapper.scheduleTransfer(transferRes.data).transferConfirmationNumber;
      transfer.transferId = confirmationNumber;

      return transfer;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async deleteTransfer(transferId: string): Promise<boolean> {
    try {
      const headers = await this.auth.getBankHeaders();
      await MeedAxios.getAxiosInstance().delete(
        `domesticScheduledPayment/${config.api.axxiome.version}/domestic-scheduled-payments/${transferId}`,
        headers
      );
      return true;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

@injectable()
export class RecurringTransferStrategy extends TransferStrategy implements ITransferStrategy {
  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  public async transfer(transfer: ITransfer): Promise<any> {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.recurringScheduleTransfer(transfer);
      const transferRes = await MeedAxios.getAxiosInstance().post(
        `/domesticStandingOrder/${config.api.axxiome.version}/domestic-standing-orders`,
        { ...apiBody },
        headers
      );
      transfer.transferId = ResponseMapper.recurringScheduleTransfer(transferRes.data).transferConfirmationNumber;
      transfer.transferType = TransferType.Recurring;
      return transfer;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  public async getTransfers(): Promise<ITransfer[]> {
    try {
      const headers = await this.auth.getBankHeaders();
      const recurRes = await MeedAxios.getAxiosInstance().get(
        `domesticStandingOrder/${config.api.axxiome.version}/domestic-standing-orders`,
        headers
      );
      return ResponseMapper.getRecurringScheduledTransfers(recurRes.data);
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @param transfer
   */
  public async modifyTransfer(transfer: ITransfer): Promise<ITransfer> {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.recurringScheduleTransfer(transfer);
      const transferRes = await MeedAxios.getAxiosInstance().put(
        `domesticStandingOrder/${config.api.axxiome.version}/domestic-standing-orders/${transfer.transferId}`,
        { ...apiBody },
        headers
      );
      const confirmationNumber = ResponseMapper.recurringScheduleTransfer(transferRes.data).transferConfirmationNumber;
      transfer.transferId = confirmationNumber;
      return transfer;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @param transferId
   */
  public async deleteTransfer(transferId: string): Promise<boolean> {
    try {
      const headers = await this.auth.getBankHeaders();
      await MeedAxios.getAxiosInstance().delete(
        `domesticStandingOrder/${config.api.axxiome.version}/domestic-standing-orders/${transferId}`,
        headers
      );
      return true;
    } catch (err) {
      const { message, errorCode, httpCode } = TransferErr.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
