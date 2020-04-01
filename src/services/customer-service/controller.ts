import { injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import logger from '../../utils/logger';
import { MeedRequest } from '../../interfaces/MeedRequest';
import { OtpResponse, ICustomerService, ContactPreference } from '../models/customer-service/interface';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';

export class CustomerServiceController {
  private static getService(req: MeedRequest): ICustomerService {
    const service = DIContainer.getNamed<ICustomerService>(TYPES.CustomerService, req.bankId);
    service.getAuthorizationService().setHeadersAndToken(req.headers, req.token);
    return service;
  }

  public static async customerInfo(req: MeedRequest, res: Response): Promise<any> {
    const service = CustomerServiceController.getService(req);
    const memberId = req.headers['meedbankingclub-memberid'] as string;
    const response = await service.customerInfo(memberId);
    res.status(200).json(response);
  }

  public static async updateCustomerInfo(req: MeedRequest, res: Response): Promise<any> {
    const service = CustomerServiceController.getService(req);
    const response = await service.updateCustomerInfo(
      req.body,
      req.files ? req.files : '',
      req.headers['meedbankingclub-memberid'],
      req.headers['meedbankingclub-customerid']
    );
    if ((response as OtpResponse).httpCode === 403) {
      res.set('meedbankingclub-otp-id', (response as OtpResponse).otpID);
      delete (response as OtpResponse).otpID;
      res.status((response as OtpResponse).httpCode).json({ data: response });
    } else {
      res.status(200).json(response);
    }
  }

  public static async updateContactPreference(req: MeedRequest, res: Response): Promise<any> {
    const service = CustomerServiceController.getService(req);
    const response = await service.updateContactPreference(req.body);
    if ((response as OtpResponse).httpCode === 403) {
      res.set('meedbankingclub-otp-id', (response as OtpResponse).otpID);
      delete (response as OtpResponse).otpID;
      res.status((response as OtpResponse).httpCode).json({ data: response });
    } else {
      res.status(200).json(response);
    }
  }

  /**
   * @static
   * @param {MeedRequest} req
   * @param {Response} res
   * @returns {Promise<any>}
   * @memberof CustomerServiceController
   */
  public static async getContactPreference(req: MeedRequest, res: Response): Promise<any> {
    const service = CustomerServiceController.getService(req);

    const response: ContactPreference = await service.getContactPreference();
    res.status(200).json(response);
  }

  public static async getPrivacyAndLegal(req: MeedRequest, res: Response): Promise<void> {
    const service = CustomerServiceController.getService(req);
    const response = await service.getPrivacyAndLegal();
    res.status(200).json(response);
  }
}
