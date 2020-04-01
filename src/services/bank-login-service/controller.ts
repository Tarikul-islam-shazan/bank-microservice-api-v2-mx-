import { IBankLoginService, BankLoginResponse } from '../models/bank-login-service/interface';
import { MeedService } from './../meedservice/service';
import { Response, NextFunction } from 'express';
import { IUserCredentials } from '../models/bank-credentials-service/interface';
import AuthMiddleware from '../../middleware/authMiddleware';
import { MeedRequest, BankIdentifier } from '../../interfaces/MeedRequest';
import DIContainer from '../../utils/ioc/ioc';
import { TYPES } from '../../utils/ioc/types';
import { BillPayProvider } from '../models/bill-pay/interface';

class BankLoginServiceController {
  public static async login(req: MeedRequest, res: Response, next: NextFunction): Promise<void> {
    const userCredentials: IUserCredentials = req.body;
    const { member, staticData } = await MeedService.getLoginData(userCredentials.username);

    const bankIdentifier: BankIdentifier = member.bank.identifier;
    const billPayProvider: BillPayProvider = member.bank.billPayProvider || BillPayProvider.IPAY;

    const bankLoginService = DIContainer.getNamed<IBankLoginService>(TYPES.AxBankLoginService, bankIdentifier);

    bankLoginService.getAuthorizationService().setHeadersAndToken(req.headers, req.token);

    member.bank = member.bank._id;
    member.inviter = member.inviter.email;
    // Step 1. Attempt login
    const loginResponse: BankLoginResponse = await bankLoginService.login(userCredentials, member, staticData);

    // Step 5 creating JWT token
    const token = await AuthMiddleware.createToken(loginResponse.token);

    // setting jwt token
    res.cookie('authToken', token, { httpOnly: true });
    res.set('MeedBankingClub-Bank-Identifier', bankIdentifier);
    res.set('MeedbankingClub-Billpay-Provider', billPayProvider);
    res.status(200).json(loginResponse.member);
  }
}

export default BankLoginServiceController;
