import { IOnboardingService } from '../../models/bank-onboarding/interface';
import { AxxiomeOnboardingService } from '../ax-service';
import { ServiceFactory as BankAuthFactory } from '../../bank-auth/factory/factory';
import { IAuthorization } from '../../bank-auth/models/interface';
import { BankIdentifier, MeedRequest } from '../../../interfaces/MeedRequest';

export class ServiceFactory {
  private static axOnboardingService = new AxxiomeOnboardingService(null);

  public static getService(identifier: BankIdentifier): IOnboardingService {
    if (identifier === BankIdentifier.Axiomme) {
      return this.axOnboardingService;
    } else {
      return this.axOnboardingService;
    }
  }
}
