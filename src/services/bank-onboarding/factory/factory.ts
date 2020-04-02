import { IOnboardingService } from '../../models/bank-onboarding/interface';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import { IvxOnboardingService } from '../ax-service';

export class ServiceFactory {
  private static ivxOnboardingService = new IvxOnboardingService(null);

  public static getService(identifier: BankIdentifier): IOnboardingService {
    if (identifier === BankIdentifier.Invex) {
      return this.ivxOnboardingService;
    } else {
      return this.ivxOnboardingService;
    }
  }
}
