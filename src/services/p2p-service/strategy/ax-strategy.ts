import { injectable, inject, named } from 'inversify';
import uuidv4 from 'uuid/v4';
import { IAuthorization } from '../../bank-auth/models/interface';
import { IBankService } from '../../models/shared/interface';
import { TYPES } from '../../../utils/ioc/types';
import { BankIdentifier } from '../../../interfaces/MeedRequest';
import { IP2PTransferStrategy, IExternalP2P, IMeedP2P } from '../../models/p2p-service/interface';
import RequestMapper from '../mappers/request-mapper';
import { MeedAxios } from '../../../utils/api';
import { HTTPError } from '../../../utils/httpErrors';
import { P2PErrors } from '../errors';
import { MeedService } from '../../meedservice/service';
import { IFundRequestService, RequestStatus } from '../../models/p2p-service/fundrequests';
import ResponseMapper from '../mappers/response-mapper';
import config from '../../../config/config';
import { P2PTransferRepository } from '../repository/p2ptransfers';
import { ContactRepository } from '../repository/contacts';

@injectable()
export abstract class P2PTransferStrategy implements IBankService {
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

@injectable()
export class InternalP2PTransferStrategy extends P2PTransferStrategy implements IP2PTransferStrategy {
  private transferRepository = new P2PTransferRepository();
  private contactRepository = new ContactRepository();

  @inject(TYPES.FundRequestService)
  @named(BankIdentifier.Axiomme)
  private fundRequestService: IFundRequestService;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Axiomme) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  public async transfer(memberId: string, transferData: IMeedP2P): Promise<IMeedP2P> {
    try {
      const headers = await this.auth.getBankHeaders();
      let fundRequest;
      const fundTransferTrackingId = transferData.trackingId || uuidv4();
      const fundSender = await MeedService.getMemberWithBankPopulated({
        _id: memberId,
        email: transferData.senderEmail
      });
      const fundReceiver = await MeedService.getMemberWithBankPopulated({ email: transferData.receiverEmail });

      if (transferData.confirmationCode) {
        fundRequest = await this.fundRequestService.findFundRequest({
          receiverEmail: transferData.senderEmail,
          requestStatus: RequestStatus.PENDING,
          confirmationCode: transferData.confirmationCode
        });

        if (!fundRequest) {
          throw new HTTPError('Invalid Fund Request', '2107', 400);
        }
      }

      transferData.trackingId = fundTransferTrackingId;

      const fundTransferRequestData = RequestMapper.fundTransferDataMapper(fundSender, fundReceiver, transferData);

      const transferBankRes = await MeedAxios.getAxiosInstance().post(
        `/createP2PTransfer/${config.api.axxiome.version}/accounts/${transferData.senderAccountId}/p2p`,
        fundTransferRequestData,
        headers
      );

      const { fundTransferConfirmation } = ResponseMapper.fundTransferResponseMapper(transferBankRes);

      const creditReceiverData = RequestMapper.creditReceiverDataMapper(fundSender, fundReceiver, transferData);
      await MeedAxios.getAxiosInstance().post(
        `/createP2PTransferRecipient/${config.api.axxiome.version}/p2p/recipient`,
        creditReceiverData,
        headers
      );

      await MeedAxios.getAxiosInstance().put(
        `/createP2PTransfer/${config.api.axxiome.version}/accounts/${transferData.senderAccountId}/p2p/${fundTransferConfirmation}`,
        {},
        headers
      );

      if (fundRequest) {
        await this.fundRequestService.updateFundRequest(fundRequest._id, memberId, {
          requestStatus: RequestStatus.ACCEPTED
        });
      }

      transferData.confirmationCode = fundTransferConfirmation;

      const [transferObject, contact] = await Promise.all([
        this.transferRepository.createTransfer(transferData),
        this.contactRepository.addContact(memberId, transferData.receiverEmail)
      ]);

      return transferObject;
    } catch (err) {
      const error = P2PErrors.extractError(err);
      if (error.otpID) {
        return error;
      }

      throw new HTTPError(error.message, error.errorCode, error.httpCode);
    }
  }
}

@injectable()
export class ExternalP2PTransferStrategy extends P2PTransferStrategy implements IP2PTransferStrategy {
  private transferRepository = new P2PTransferRepository();
  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Axiomme) injectedAuth: IAuthorization) {
    super(injectedAuth);
  }

  public async transfer(memberId: string, transferData: IExternalP2P): Promise<IExternalP2P> {
    try {
      const headers = await this.auth.getBankHeaders();
      transferData.trackingId = uuidv4();
      const fundSender = await MeedService.getMemberWithBankPopulated({
        _id: memberId,
        email: transferData.senderEmail
      });
      const externalTransferMappedData = RequestMapper.externalTransferDataMapper(fundSender.customerId, transferData);

      const externalTransferBankResponse = await MeedAxios.getAxiosInstance().post(
        `/createP2PTransfer/${config.api.axxiome.version}/accounts/${transferData.senderAccountId}/p2p`,
        externalTransferMappedData,
        headers
      );

      const externalTransferBankMappedResponse = ResponseMapper.externalTransferResponseMapper(
        externalTransferBankResponse
      );

      if (externalTransferBankMappedResponse.errorCode) {
        throw new Error(externalTransferBankMappedResponse.errorCode);
      }

      const confirmationCode = externalTransferBankMappedResponse.confirmationCode;
      await this.transferRepository.createTransfer({
        ...transferData,
        confirmationCode
      });

      return { confirmationCode };
    } catch (err) {
      const { message, errorCode, httpCode } = P2PErrors.extractError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}
