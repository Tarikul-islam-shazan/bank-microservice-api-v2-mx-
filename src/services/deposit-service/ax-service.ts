import { injectable, inject, named } from 'inversify';
import {
  IDepositService,
  DepositFund,
  DepositCheck,
  DepositMoney,
  DepositCheckResp,
  DepositMoneyResp,
  DepositFundRes
} from '../models/deposit-service/interface';
import { HTTPError } from '../../utils/httpErrors';
import { AxxiomeRequestMapper, AxxiomeResponseMapper } from './mappers';
import { MeedAxios } from '../../utils/api';
import { IAuthorization } from '../bank-auth/models/interface';
import { AxDepositErrMapper, AxErrorCodes } from './errors';
import { AxErrorMapper } from '../../utils/error-mapper/axError';
import { MeedService } from './../meedservice/service';
import { MeedRequest, BankIdentifier } from './../../interfaces/MeedRequest';
import { SendGrid, ISendGridTemplate } from '../../utils/sendgrid/sendGridHelper';
import { TYPES } from '../../utils/ioc/types';
import { IAccountService } from '../models/account-service/interface';
import { readFileSync, unlinkSync } from 'fs';
import { ICustomerService } from '../models/customer-service/interface';
import config from '../../config/config';

@injectable()
export class AxxiomeDepositService implements IDepositService {
  private auth: IAuthorization;

  @inject(TYPES.AxAccountService)
  @named(BankIdentifier.Invex)
  private accountService: IAccountService;

  @inject(TYPES.CustomerService)
  @named(BankIdentifier.Invex)
  private customerService: ICustomerService;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async depositFund(req: DepositFund, memberId): Promise<DepositFundRes> {
    try {
      // const member = await MeedService.findMemberByEmail(req.email.toLowerCase());
      const isLoggedIn = this.auth.isLoggedIn();
      if (isLoggedIn) {
        this.customerService.setAuthorizationService(this.auth);
        const customerData = await this.customerService.customerInfo(memberId);
        const fullName = `${customerData.salutation} ${customerData.firstName} ${customerData.middleName} ${customerData.lastName}`;
        const depositData = {
          ...req,
          ...customerData,
          name: fullName.toUpperCase()
        };
        req = depositData as DepositFund;
      }

      const response = await this.sendEmail(req);
      return AxxiomeResponseMapper.depositFund(response);
    } catch (error) {
      const errorResponse = AxDepositErrMapper.depositFundResponse(error);
      throw new HTTPError(errorResponse.message, errorResponse.errorCode, errorResponse.httpCode);
    }
  }

  async depositMoney(req: DepositMoney): Promise<DepositMoneyResp> {
    const headers = await this.auth.getBankHeaders();
    try {
      const apiBody = AxxiomeRequestMapper.depositMoneyReq(req);
      const response = await MeedAxios.getAxiosInstance().post(
        `/accountFunding/${config.api.axxiome.version}/accounts/fundings`,
        { ...apiBody },
        headers
      );
      return AxxiomeResponseMapper.depositMoney(response.data);
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async depositCheck(req: DepositCheck, files: any): Promise<DepositCheckResp> {
    const headers = await this.auth.getBankHeaders();
    try {
      this.accountService.getAuthorizationService().setHeadersAndToken(this.auth.getMeedHeaders());
      const accountServiceResponse = await this.accountService.getAccountSummary();
      const accounutInfo = accountServiceResponse.filter(account => account.accountNumber === req.accountNumber);
      req.identification = accounutInfo[0].accountNumber;
      req.secondaryIdentification = accounutInfo[0].routingNumber;
      const apiBody = AxxiomeRequestMapper.depositCheckReq(req);
      if (files.frontCheckImage && files.frontCheckImage[0]) {
        const frontCheckImageFilePath = files.frontCheckImage[0].path;
        const frontCheckImage = await readFileSync(frontCheckImageFilePath);
        apiBody.Data.Initiation.SupplementaryData.ChequeImage.FrontImage = `${frontCheckImage.toString('base64')}`;
        await unlinkSync(frontCheckImageFilePath);
      }
      if (files.backCheckImage && files.backCheckImage[0]) {
        const backCheckImageFilePath = files.backCheckImage[0].path;
        const backCheckImage = await readFileSync(backCheckImageFilePath);
        apiBody.Data.Initiation.SupplementaryData.ChequeImage.BackImage = `${backCheckImage.toString('base64')}`;
        await unlinkSync(backCheckImageFilePath);
      }
      const response = await MeedAxios.getAxiosInstance().post(
        `/mobileChequeDepositOrder/${config.api.axxiome.version}/mobile-cheque-deposit`,
        { ...apiBody },
        headers
      );
      return AxxiomeResponseMapper.depositCheck(response.data);
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async sendEmail(req: any) {
    try {
      const request: any = req;
      const emailConfig = SendGrid.getConfigByLanguage();

      const email: ISendGridTemplate = {
        sender: emailConfig.templates.Direct_Deposit.sender,
        senderName: emailConfig.templates.Direct_Deposit.senderName,
        receiver: req.email
      };

      const templateData: any = {
        YEAR: new Date().getFullYear(),
        NAME: request.name,
        ADDRESS: request.address,
        CITY: request.city,
        STATE: request.state,
        ZIPCODE: request.zipCode,
        ACCOUNT_NUMBER: request.accountNumber,
        BANK_ROUTING_NUMBER: request.bankRoutingNumber,
        NAME_BUSINESS: request.businessName
      };

      email.templateId = emailConfig.templates.Direct_Deposit.id;
      email.groupID = emailConfig.templates.Direct_Deposit.groupID;

      email.templateData = templateData;
      const emailResponse = await SendGrid.sendWithTemplate(email);
      return emailResponse;
    } catch (error) {
      throw new Error(error);
    }
  }
}
