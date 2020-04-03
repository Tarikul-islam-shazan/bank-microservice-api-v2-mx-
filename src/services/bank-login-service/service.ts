import { IRegisteredMember } from '../models/bank-login-service/interface';
import { injectable, inject, named } from 'inversify';
import { IAuthorization } from '../bank-auth/models/interface';
import { TYPES } from '../../utils/ioc/types';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import { IAccount, IAccountService } from '../models/account-service/interface';
import {
  IBankCredentialService,
  IBankAPICredentials,
  IUserCredentials
} from '../models/bank-credentials-service/interface';
import IAuthToken from '../../interfaces/authToken';
import { IMember, ApplicationProgress, AccountStatus, ApplicationStatus } from '../models/meedservice/member';
import { MeedService } from '../meedservice/service';
import { BankLoginResponse } from '../models/bank-login-service/interface';
import { IBankService } from '../models/shared/interface';
import { IStaticData } from '../models/meedservice';

@injectable()
export class AxBankLoginService implements IBankService {
  private auth: IAuthorization;
  @inject(TYPES.AxBankCredentials)
  @named(BankIdentifier.Invex)
  private bankCredentialService: IBankCredentialService;

  @inject(TYPES.AxAccountService)
  @named(BankIdentifier.Invex)
  private accountService: IAccountService;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async login(
    userCredentials: IUserCredentials,
    member: IMember,
    staticData: IStaticData[]
  ): Promise<BankLoginResponse> {
    let accounts: IAccount[];

    this.bankCredentialService.setAuthorizationService(this.auth);

    // Step 1. Attempt login
    const creds: IBankAPICredentials = await this.bankCredentialService.login(userCredentials);

    const bankToken = creds.bankToken;
    const accessToken = creds.accessToken;

    // Step 2. Set Auth Token on request for further authenticated requests to use it
    const token = { bankToken, accessToken } as IAuthToken;

    // Step 3. Packing Static Data and member data
    let registeredMember: IRegisteredMember = member as IRegisteredMember;

    /**
     * // TODO: Meed Rewards Earnd Not yet implemented
     * Will implemented in future
     * hard coded for now
     */
    registeredMember.meedRewardsEarned = 0;
    registeredMember = { ...registeredMember, configurationData: staticData };

    // Step 4. Check if Registration Complete & Then Get accountSummary
    if (
      member.applicationProgress === ApplicationProgress.TermsAndConditionAccepted ||
      member.applicationProgress === ApplicationProgress.AccountFunded ||
      member.applicationStatus === ApplicationStatus.Completed
    ) {
      this.accountService.getAuthorizationService().setHeadersAndToken(this.auth.getMeedHeaders(), token);
      accounts = await this.accountService.getAccountSummary();
      if (!accounts.length && registeredMember.accountStatus !== AccountStatus.Closed) {
        await MeedService.updateMember({ id: (registeredMember as any)._id, accountStatus: AccountStatus.Closed });
        registeredMember.accountStatus = AccountStatus.Closed;
      }
      registeredMember.accountSummary = accounts;
    }

    return { token, member: registeredMember };
  }
}
