import { AxiommeAuthorization } from './ax-auth';
import { IAuthorization } from '../models/interface';
import { BankIdentifier, MeedRequest } from '../../../interfaces/MeedRequest';

export class ServiceFactory {
  private static axAuthService: AxiommeAuthorization;

  public static getService(req: MeedRequest): IAuthorization {
    if (req.bankId === BankIdentifier.Axiomme) {
      if (!ServiceFactory.axAuthService) {
        ServiceFactory.axAuthService = new AxiommeAuthorization();
        return this.axAuthService;
      }
      this.axAuthService.setHeader(req);
      return this.axAuthService;
    } else {
      return this.axAuthService;
    }
  }

  public static updateToken(req: MeedRequest) {
    this.axAuthService.setToken(req);
  }
}
