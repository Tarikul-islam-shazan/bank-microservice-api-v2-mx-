import { IUserCredentials } from '../bank-credentials-service/interface';
import { IStaticData } from '../meedservice';
import { IAccount } from '../account-service/interface';
import { IMember } from '../meedservice/member';
import IAuthToken from '../../../interfaces/authToken';
import { IBankService } from '../shared/interface';

export interface IBankLoginService extends IBankService {
  login(creds: IUserCredentials, member: IMember, staticData: IStaticData[]): Promise<BankLoginResponse>;
}

export interface BankLoginResponse {
  token: IAuthToken;
  member: IRegisteredMember;
}

export interface IRegisteredMember extends IMember {
  meedRewardsEarned: number;
  accountSummary: IAccount[];
  configurationData: IStaticData[];
}
