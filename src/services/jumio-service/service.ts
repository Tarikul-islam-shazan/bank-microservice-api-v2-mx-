import { MeedAxios } from '../../utils/api';
import { HTTPError } from '../../utils/httpErrors';
import { injectable, inject, named } from 'inversify';
import { IAuthorization } from '../bank-auth/models/interface';
import { TYPES } from '../../utils/ioc/types';
import { BankIdentifier } from '../../interfaces/MeedRequest';
import { JumioErrorsMapper, JumioErrors } from './errors';
import RequestMapper from './mappers/request-mapper';
import config from '../../config/config';
import { ErrorMapper } from '../../utils/error-mapper/errorMapper';
import {
  IJumioService,
  JumioWebInitiateResponse,
  JumioWebInitiateRequest,
  IJumioRetrieveDetails
} from '../models/jumio-service/interface';
import { ApplicationProgress, ITransition } from '../models/meedservice';
import { MeedService } from '../meedservice/service';

@injectable()
class JumioService implements IJumioService {
  private auth: IAuthorization;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async webInitiate(jumioData: JumioWebInitiateRequest): Promise<JumioWebInitiateResponse> {
    try {
      const jumioResponse = await MeedAxios.getAxiosInstanceForJumio().post('/initiate', jumioData);

      return jumioResponse.data as JumioWebInitiateResponse;
    } catch (err) {
      const { message, errorCode, httpCode } = JumioErrorsMapper.getJumioError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async verification(memberId, verificationData: any): Promise<object> {
    try {
      const headers = await this.auth.getBankHeaders();
      const username = verificationData.customerId;
      const transitions: ITransition[] = [{ memberId, status: ApplicationProgress.JumioScanStarted }];
      headers['X-axxiome-digital-user'] = username;

      let identityVerification;
      if (typeof verificationData.identityVerification === 'string') {
        identityVerification = JSON.parse(verificationData.identityVerification);
      } else {
        identityVerification = verificationData.identityVerification;
      }

      if (
        verificationData.verificationStatus === 'ERROR_NOT_READABLE_ID' ||
        verificationData.verificationStatus === 'NO_ID_UPLOADED'
      ) {
        transitions.push({
          memberId,
          status: ApplicationProgress.JumioScanFailed
        });
      } else {
        transitions.push({
          memberId,
          status: ApplicationProgress.JumioScanSucceeded
        });
      }

      if (
        verificationData.verificationStatus === 'APPROVED_VERIFIED' &&
        identityVerification.similarity === 'MATCH' &&
        identityVerification.validity
      ) {
        transitions.push({
          memberId,
          status: ApplicationProgress.JumioVerifyApproved
        });
      } else {
        transitions.push({
          memberId,
          status: ApplicationProgress.JumioVerifyDenied
        });
      }
      await MeedService.addTransitions(transitions);

      const transformedVerificationData = RequestMapper.jumioDataMapper(verificationData);
      const response = await MeedAxios.getAxiosInstance().post(
        `/jumioEvents/${config.api.axxiome.version}/jumio/events?seckey=${config.api.axxiome.secKey}`,
        transformedVerificationData,
        headers
      );

      return {};
    } catch (err) {
      const { message, errorCode, httpCode } = ErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  async retrieveDetails(reference: string): Promise<IJumioRetrieveDetails> {
    try {
      const scanStatus = await MeedAxios.getAxiosInstanceForJumio(true).get(`${reference}`);
      const status = scanStatus.data && scanStatus.data.status && scanStatus.data.status.toUpperCase();

      // checking scan status
      if (status === 'FAILED') {
        const { message, errorCode, httpCode } = JumioErrors.VERIFICATION_STATUS_FAILED;
        throw new HTTPError(message, errorCode, httpCode);
      } else if (status === 'PENDING') {
        const { message, errorCode, httpCode } = JumioErrors.VERIFICATION_STATUS_PENDING;
        throw new HTTPError(message, errorCode, httpCode);
      }

      const response = await MeedAxios.getAxiosInstanceForJumio(true).get(`${reference}/data`);

      return response.data;
    } catch (err) {
      if (err instanceof HTTPError) {
        throw err;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
}

export default JumioService;
