import { injectable } from 'inversify';
import { IAuthorization } from '../../bank-auth/models/interface';
import { IBankService } from '../../models/bill-pay/interface';

@injectable()
export abstract class BillPayStrategy implements IBankService {
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
