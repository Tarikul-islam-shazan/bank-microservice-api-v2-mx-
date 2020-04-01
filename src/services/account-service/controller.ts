import { Response } from 'express';
import moment from 'moment';
import { MeedRequest } from '../../interfaces/MeedRequest';
import { ITransaction, ITransactionQueries, IAccountService } from '../models/account-service/interface';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';

class AccountServiceController {
  public static async accountSummary(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<IAccountService>(TYPES.AxAccountService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const response = await service.getAccountSummary();

    res.status(200).json({ accounts: response });
  }

  static async getTransactions(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<IAccountService>(TYPES.AxAccountService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const transactions = await service.getTransactions(req.params.accountId, req.query);

    res.status(200).json(transactions);
  }

  public static async statements(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<IAccountService>(TYPES.AxAccountService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const accountId = req.params.accountId;

    const response = await service.getStatements(accountId);

    res.status(200).json(response);
  }

  public static async statementDetails(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<IAccountService>(TYPES.AxAccountService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    const accountId = req.params.accountId;
    const statementId = req.params.statementId;

    const response = await service.getStatementDetails(accountId, statementId);

    res.status(200).json(response);
  }

  public static async sweepState(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<IAccountService>(TYPES.AxAccountService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    const state = await service.getSweepState();
    res.status(200).json(state);
  }

  public static async updateSweepState(req: MeedRequest, res: Response): Promise<void> {
    const service = DIContainer.getNamed<IAccountService>(TYPES.AxAccountService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    const response = await service.updateSweepState(req.body);
    res.status(200).json(response);
  }
}

export default AccountServiceController;
