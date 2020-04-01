import { NextFunction, Response } from 'express';

import { MeedRequest } from '../../interfaces/MeedRequest';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import { IBillPayee, IBillPayment, IBillPayStrategy, IBillerTokenMeta } from '../models/bill-pay/interface';
import { BillPayService } from './ax-service';

export default class BillPayController {
  // A helper method to reduce rewriting this same functionality in every methods below
  private static getService(req: MeedRequest): BillPayService {
    const strategy = req.headers['meedbankingclub-billpay-provider'];
    const service = DIContainer.getTagged<BillPayService>(TYPES.BillPayService, req.bankId, strategy);
    service.setAuth(req.headers, req.token);
    return service;
  }

  //#region Payee
  static async addPayee(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    // insted of this.getService(req) using class name because in runtime throwing `this undefined`
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const addedPayee = await service.addPayee(customerId, req.body as IBillPayee);
    if ((addedPayee as any).otpID) {
      res.set('meedbankingclub-otp-id', (addedPayee as any).otpID);
      delete (addedPayee as any).otpID;
      res.status(403).json({ data: addedPayee });
    } else {
      res.json(addedPayee);
    }
  }

  static async getPayeeList(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const queries = {} as any;
    [
      'withNotActivatedPayees',
      'withPaymentMethodType',
      'withOnlyElectronicBillsSupported',
      'withDeletedPayees',
      'fromModifiedStartDate',
      'toModifiedStartDate'
    ].forEach(k => {
      if (req.query[k] !== undefined && req.query[k] !== null) {
        queries[k] = req.query[k];
      }
    });

    const customerId = req.header('meedbankingclub-customerid');
    const payees = await service.getPayeeList(customerId, queries);
    res.json(payees);
  }

  static async getPayee(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const payeeId = req.params.id;
    const payee = await service.getPayee(customerId, payeeId);
    res.json(payee);
  }

  static async deletePayee(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const payeeId = req.params.id;
    await service.deletePayee(customerId, payeeId);
    res.status(204).json();
  }

  static async editPayee(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const payee = req.body as IBillPayee;
    payee.payeeId = req.params.id;
    const editedPayee = await service.editPayee(customerId, payee);
    res.json(editedPayee);
  }
  //#endregion

  //#region Payment
  static async createPayment(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const addedPayment = await service.createPayment(customerId, req.body as IBillPayment);
    if ((addedPayment as any).otpID) {
      res.set('meedbankingclub-otp-id', (addedPayment as any).otpID);
      delete (addedPayment as any).otpID;
      res.status(403).json({ data: addedPayment });
    } else {
      res.json(addedPayment);
    }
  }

  static async getPayments(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const queries = {} as any;
    [
      'PayeeId',
      'fromPaymentSchedDate',
      'toPaymentSchedDate',
      'minPaymentAmount',
      'maxPaymentAmount',
      'paymentStatus'
    ].forEach(k => {
      if (req.query[k] !== null && req.query[k] !== undefined) {
        queries[k] = req.query[k];
      }
    });

    const customerId = req.header('meedbankingclub-customerid');
    const payments = await service.getPayments(customerId, queries);
    res.json(payments);
  }

  static async getPayment(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const payment = await service.getPayment(customerId, req.params.id);
    res.json(payment);
  }

  static async editPayment(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const payment = await service.editPayment(customerId, req.params.id, req.body as IBillPayment);
    res.json(payment);
  }

  static async deletePayment(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    await service.deletePayment(customerId, req.params.id);
    res.status(204).json();
  }
  //#endregion

  //#region eBill
  static async getEBills(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const eBills = await service.getEBills(customerId);
    res.json(eBills);
  }
  //#endregion
  //#region Token
  static async createToken(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const service = BillPayController.getService(req);

    const customerId = req.header('meedbankingclub-customerid');
    const providerToken = await service.createToken(customerId, req.body as IBillerTokenMeta);
    res.json(providerToken);
  }
  //#endregion
}
