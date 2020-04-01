import { TransferUtil } from './util/util';
import { MeedRequest } from './../../interfaces/MeedRequest';
import { Request, Response } from 'express';
import { TransferService } from './ax-service';
import { TransferType, ITransfer, ITransferStrategy } from '../models/internal-transfer/interface';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import { AccountService } from '../account-service/ax-service';

export class TransferController {
  /**
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof TransferController
   */
  public static async getTransfers(req: MeedRequest, res: Response): Promise<any> {
    const accountService = DIContainer.getNamed<AccountService>(TYPES.AxAccountService, req.bankId);
    accountService.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    const accounts = await accountService.getAccountSummary();

    const service = DIContainer.getNamed<TransferService>(TYPES.AxTransferService, req.bankId);
    const recurringStrategy = DIContainer.getTagged<ITransferStrategy>(
      TYPES.AxTransferStrategy,
      req.bankId,
      TransferType.Recurring
    );

    recurringStrategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    service.setTransferStrategy(recurringStrategy);
    const recurringTransfers = await service.getTransfers();

    const scheduledStrategy = DIContainer.getTagged<ITransferStrategy>(
      TYPES.AxTransferStrategy,
      req.bankId,
      TransferType.Scheduled
    );
    scheduledStrategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    service.setTransferStrategy(scheduledStrategy);
    const scheduledTransfers = await service.getTransfers();
    const alltrasfers = TransferUtil.sortTransfersByDate([...recurringTransfers, ...scheduledTransfers], accounts);

    res.status(200).json(alltrasfers);
  }

  /**
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof TransferController
   */
  public static async transfer(req: MeedRequest, res: Response): Promise<any> {
    const service = DIContainer.getNamed<TransferService>(TYPES.AxTransferService, req.bankId);
    const transferType = TransferUtil.getTransferType(req.body);
    const strategy = DIContainer.getTagged<ITransferStrategy>(TYPES.AxTransferStrategy, req.bankId, transferType);

    strategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    service.setTransferStrategy(strategy);

    const transfer = await service.transfer(req.body);
    res.status(200).json(transfer);
  }

  /**
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof TransferController
   */
  public static async modifyTransfer(req: MeedRequest, res: Response): Promise<any> {
    let transfer: ITransfer = req.body as ITransfer;

    const service = DIContainer.getNamed<TransferService>(TYPES.AxTransferService, req.bankId);
    const currentTransferType = TransferUtil.getTransferType(req.body);
    const previousTransferType = transfer.previousTransferType;

    let strategy: ITransferStrategy;

    if (currentTransferType === previousTransferType) {
      // this implies its just a modification and we can only modify rescheduled or recurring
      // transfers since immediate transfers are done right away and cannot be modified
      strategy = DIContainer.getTagged<ITransferStrategy>(TYPES.AxTransferStrategy, req.bankId, currentTransferType);
      strategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
      service.setTransferStrategy(strategy);
      transfer = await service.modifyTransfer(transfer);
    } else {
      // delete the previous first then recreate the new kind
      strategy = DIContainer.getTagged<ITransferStrategy>(TYPES.AxTransferStrategy, req.bankId, previousTransferType);
      strategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
      service.setTransferStrategy(strategy);
      await service.deleteTransfer(transfer.transferId as string);

      // now create the new one
      strategy = DIContainer.getTagged<ITransferStrategy>(TYPES.AxTransferStrategy, req.bankId, currentTransferType);
      strategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
      service.setTransferStrategy(strategy);
      transfer = await service.transfer(transfer);
    }

    res.status(200).json(transfer);
  }

  /**
   * @static
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof TransferController
   */
  public static async deleteTransfer(req: MeedRequest, res: Response): Promise<any> {
    const transfer = {
      transferId: req.query.transferId,
      transferType: req.query.transferType
    } as ITransfer;

    const service = DIContainer.getNamed<TransferService>(TYPES.AxTransferService, req.bankId);
    const strategy = DIContainer.getTagged<ITransferStrategy>(
      TYPES.AxTransferStrategy,
      req.bankId,
      transfer.transferType
    );
    strategy.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    service.setTransferStrategy(strategy);
    const status = await service.deleteTransfer(transfer.transferId as string);

    res.status(200).json({ status });
  }
}
