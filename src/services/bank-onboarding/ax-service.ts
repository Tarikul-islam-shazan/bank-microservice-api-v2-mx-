import { BankIdentifier } from '../../interfaces/MeedRequest';
import {
  Credential,
  IOnboardingService,
  IdentityQuestions,
  IdentityAnswers,
  ProductOnboardedResponse,
  RegistrationFeeRequest,
  FundAccountResponse,
  BankApplication,
  USMemberInfo,
  IScannedIdData,
  TncResponse
} from '../models/bank-onboarding/interface';
import { IMember, MemberType, AccountStatus } from '../models/meedservice/member';
import { HTTPError } from '../../utils/httpErrors';
import { OnboardingErrMapper } from './errors';
import { AxErrorMapper } from '../../utils/error-mapper/axError';
import { RequestMapper, ResponseMapper } from './mappers/';
import { MeedAxios } from '../../utils/api';
import { IAuthorization } from '../bank-auth/models/interface';
import { ApplicationProgress, ApplicationStatus } from '../models/meedservice/member';
import { MeedService } from '../meedservice/service';
import { injectable, inject, named } from 'inversify';
import { TYPES } from '../../utils/ioc/types';
import config from '../../config/config';
import { IPromotionService, AxPromotionCode } from '../models/promotion-service/interface';
import logger from '../../utils/logger';
import { IUrbanAirshipService } from '../models/urban-airship/interface';
import httpContext from 'express-http-context';
import uuidv4 from 'uuid/v4';
import { AccountType } from '../models/account-service/interface';

@injectable()
export class AxxiomeOnboardingService implements IOnboardingService {
  private auth: IAuthorization;

  @inject(TYPES.PromotionService)
  @named(BankIdentifier.Invex)
  private promotionService: IPromotionService;

  @inject(TYPES.UrbanAirshipService)
  private uasService: IUrbanAirshipService;

  constructor(@inject(TYPES.AxBankAuthorization) @named(BankIdentifier.Invex) injectedAuth: IAuthorization) {
    this.auth = injectedAuth;
  }

  public setAuthorizationService(authService: IAuthorization): void {
    this.auth = authService;
  }

  public getAuthorizationService(): IAuthorization {
    return this.auth;
  }

  async createLogin(username: string, credential: Credential): Promise<void> {
    const headers = await this.auth.getBankHeaders();
    const apiBody = RequestMapper.createLogin(credential);
    try {
      await MeedAxios.getAxiosInstance().post(
        `/userManagement/${config.api.axxiome.version}/users/${username}/provision`,
        { ...apiBody },
        headers
      );
    } catch (error) {
      const { errorCode, httpCode, message } = OnboardingErrMapper.mapCreateLoginError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  //#region dummy jumio web hook
  /**
   * TODO: This method will be called automatically by jumio.
   * TODO: need to setup the web hook routes
   *
   * @param {string} username
   * @returns
   * @memberof AxxiomeOnboardingService
   */
  async jumioWebHookCallback(username: string) {
    try {
      const headers = await this.auth.getBankHeaders();
      const apiBody = RequestMapper.jumioWebHookRequest(username);
      const response = await MeedAxios.getAxiosInstance().post(
        `/jumioEvents/${config.api.axxiome.version}/jumio/events?seckey=TUVFRF9BUElfVVNFUjo1OFV6UXpiRUZoeDllVW5I`,
        { ...apiBody },
        headers
      );
      return response.data;
    } catch (error) {
      // console.log(error);
      throw new HTTPError('Jumio web hook submission to axxiome failed');
    }
  }
  //#endregion

  //#region apply for account
  /**
   * This method will create an account id if this is successful, otherwise it may gives some identity verification question
   * If user drop off from identity verification and need to fetch identity verification question again please call 'getIdentityQuestions'
   * to fetch the questions again
   *
   * @param {string} memberId
   * @param {BankApplication} application
   * @returns {(Promise<IMember | IdentityQuestions>)}
   * @memberof AxxiomeOnboardingService
   * @version v1.0.0
   */
  async applyForAccount(memberId: string, application: BankApplication): Promise<IMember | IdentityQuestions> {
    // before apply for account there will be a call to axxiome from jumio web hook
    const memberInfo = application.memberApplication as USMemberInfo;
    const scannedIdData = application.scannedIdData as IScannedIdData;

    // TODO: this is just for bypassing jumio web hook. as we test it from postman
    await this.jumioWebHookCallback(memberInfo.firstName);

    // add corporate customer id if inviters type is corporate
    const member = await MeedService.findMemberById(memberId);
    if (member.inviter) {
      const inviter = await MeedService.findMemberById(member.inviter);
      (memberInfo as any).corporateCustomerId = inviter.memberType === MemberType.Corporate ? inviter.customerId : '';
    }

    const apiBody = RequestMapper.applyForAccount(memberInfo, scannedIdData);
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/customerOnboarding/2.3.0/onboardings/customers`,
        { ...apiBody },
        headers
      );
      const httpCode = response.status;
      if (httpCode === 200) {
        // http code 200 indicates that we need identity verification(KYC) for this user
        // that means applicationProgress is bank application submitted and identity question viewed
        // updating status twice because it will create two transition
        await MeedService.updateMember({
          id: memberId,
          applicationProgress: ApplicationProgress.BankApplicationSubmitted
        });
        await MeedService.updateMember({
          id: memberId,
          applicationProgress: ApplicationProgress.IdentityQuestionsViewed
        });
        return ResponseMapper.applyForAccountIdentity(response.data);
      } else if (httpCode === 201) {
        // SignUp successful, no identity verification required for this user.
        const customer = ResponseMapper.applyForAccountComplete(response.data);
        await MeedService.updateMember({
          id: memberId,
          customerId: customer.customerId,
          applicationProgress: ApplicationProgress.BankApplicationSubmitted
        });

        return customer;
      } else {
        throw new Error('Unknown status code in apply for account response');
      }
    } catch (error) {
      const { errorCode, httpCode, message } = OnboardingErrMapper.mapApplyForAccountError(error);

      // TODO: need to discuss about http error for UAS service
      if (httpCode === 406) {
        await MeedService.updateMember({
          id: memberId,
          applicationProgress: ApplicationProgress.BankApplicationSubmitted,
          applicationStatus: ApplicationStatus.Denied
        });

        await this.pushEvent(memberId, 'APPLICATION_DENIED', 'Denied');
      }

      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region start product onboarding
  /**
   * TODO: may be we need a member progress status 'PRODUCT_ONBOARDED'
   * This need to called after application submitting to axxiome and before terms and condition
   *
   * @private
   * @static
   * @memberof OnboardingController
   */

  async startProductOnboarding(memberId: string, customerId: string): Promise<void> {
    try {
      // apply promotion if eligible
      let promotionCode = '';
      try {
        const promotion = await this.promotionService.getPromotionForInviter(memberId);
        promotionCode = promotion.promotionCode;
      } catch (error) {
        // This user do not have any promotion, ignoring this error
        // But logging it for reference
        const context = httpContext.get('loggingContext');
        httpContext.set('loggingContext', { ...context, promotionError: error });
      }
      const apiBody = RequestMapper.startProductOnboarding(customerId, promotionCode);
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/accountOrigination/2.3.0/originations/products`,
        { ...apiBody },
        headers
      );

      await MeedService.updateMember({
        id: memberId,
        applicationProgress: ApplicationProgress.ProductOnboarded
      });
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region Get identity question
  /**
   * This method required bankToken to be present in Token.
   * Because we only need to fetch identity verification using this method ONLY when user drop off from SignUp
   * Otherwise in normal flow user will get same result from 'applyForAccount' method
   */
  async getIdentityQuestions(): Promise<IdentityQuestions> {
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/customerOnboarding/2.3.0/onboardings/customers/kycquiz`,
        headers
      );
      return ResponseMapper.getIdentityQuestions(response.data);
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  //#region set identity question
  /**
   * Set identity question
   *
   * @param {IdentityAnswers} answers
   * @returns {Promise<any>}
   * @memberof AxxiomeOnboardingService
   * @version v1.0.0
   */
  async setIdentityQuestionsAnswers(answers: IdentityAnswers): Promise<any> {
    const apiBody = RequestMapper.setIdentityQuestionsAnswers(answers);
    const headers = await this.auth.getBankHeaders();
    const response = await MeedAxios.getAxiosInstance().post(
      `/customerOnboarding/2.3.0/onboardings/customers/kycquiz`,
      { ...apiBody },
      headers
    );
    return response;
  }
  //#endregion

  //#region get terms and condition
  async getTermsAndConditions(memberId: string): Promise<TncResponse> {
    try {
      let hasPromotion = false;
      const member = await MeedService.findMemberById(memberId);
      if (
        member.applicationProgress === ApplicationProgress.BankApplicationSubmitted ||
        member.applicationProgress === ApplicationProgress.IdentityQuestionsAnswered
      ) {
        await this.startProductOnboarding((member as any)._id, member.customerId);
      }

      /**
       * Here we are checking if the inviter has any promotion
       * If has promotion and if has FuLL_REBATE or PARTIAL_REBATE
       * then will show checkbox on UI
       */
      try {
        const promotion = await this.promotionService.getPromotionForInviter(memberId);
        if (
          promotion.promotionCode === AxPromotionCode.FULL_REBATE ||
          promotion.promotionCode === AxPromotionCode.PARTIAL_REBATE
        ) {
          hasPromotion = true;
        }
      } catch (error) {
        // This user do not have any promotion, ignoring this error
        // But logging it for reference
        const context = httpContext.get('loggingContext');
        httpContext.set('loggingContext', { ...context, promotionError: error });
      }

      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().get(
        `/accountOrigination/2.3.0/originations/products/agreement`,
        headers
      );
      const terms = ResponseMapper.getTermsAndConditions(response.data);
      return this.formatTermsAndCondition(terms, hasPromotion);
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  private formatTermsAndCondition(response: TncResponse, hasPromotion: boolean): TncResponse {
    // grouping terms and condition according with title
    const group = [
      ['Electronic Communications'],
      ['Checking Account Agreement', 'Savings Account Agreement'],
      [
        'Funds Availability Disclosure',
        'Electronic Funds Transfer Disclosure',
        'Savings Truth In Savings Disclosure',
        'Checking Truth In Savings Disclosure',
        'Fee Schedule'
      ],
      ['Truth In Lending Disclosure and Agreement'],
      ['W-9']
    ];
    const groupTitle = ['tnc1', 'tnc2', 'tnc3', 'tnc4', 'tnc5'];
    const documents = [];
    group.forEach((doc, idx) => {
      documents.push({
        title: groupTitle[idx],
        documents: []
      });

      doc.forEach(title => {
        const foundDoc = response.termsAndConditions.find(item => item.title === title);
        if (foundDoc) {
          documents[idx].documents.push(foundDoc);
        }
      });
    });
    return { termsAndConditions: documents, processId: response.processId, showCorporateTnc: hasPromotion };
  }

  //#region accept Terms and condition
  async acceptTermsAndConditions(
    memberId: string,
    isTermsAccepted: boolean,
    processId: string,
    corporateTncAccepted: boolean | undefined
  ): Promise<ProductOnboardedResponse> {
    try {
      const apiBody = RequestMapper.acceptTermsAndConditions(isTermsAccepted, processId);
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/accountOrigination/2.3.0/originations/products/agreement`,
        { ...apiBody },
        headers
      );

      const responseData = ResponseMapper.acceptTermsAndCondition(response.data);
      const isHold = responseData.accounts.find(account => account.accountType === AccountType.DDA)?.isHold;

      await MeedService.updateMember({
        id: memberId,
        applicationProgress: ApplicationProgress.TermsAndConditionAccepted,
        ...((corporateTncAccepted === true || corporateTncAccepted === false) && { corporateTncAccepted }),
        ...(isHold && { applicationStatus: ApplicationStatus.OnHold })
      });

      if (isHold === true) {
        await this.pushEvent(memberId, 'APPLICATION_ON_HOLD', 'Hold');
      }

      return responseData;
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }
  //#endregion

  async fundAccount(memberId: string, funding: RegistrationFeeRequest): Promise<FundAccountResponse> {
    const apiBody = RequestMapper.fundAccount(funding);
    try {
      const headers = await this.auth.getBankHeaders();
      const response = await MeedAxios.getAxiosInstance().post(
        `/accountFunding/${config.api.axxiome.version}/accounts/fundings`,
        { ...apiBody },
        headers
      );

      // update application progress and create transition
      await MeedService.updateMember({
        id: memberId,
        applicationProgress: ApplicationProgress.RegistrationCompleted,
        applicationStatus: ApplicationStatus.Completed,
        accountStatus: AccountStatus.Opened
      });

      await this.pushEvent(memberId, 'REGISTRATION_COMPLETED', 'Approved');

      return ResponseMapper.fundAccount(response.data);
    } catch (error) {
      const { errorCode, httpCode, message } = AxErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * Send custom event push notification
   * @private
   * @param {IError} errResponse
   * @param {string} memberId
   * @returns {Promise<void>}
   * @memberof AxxiomeOnboardingService
   */
  private async pushEvent(memberId: string, tag: string, status: string): Promise<void> {
    try {
      const member = await MeedService.findMemberById(memberId);
      const emailLookup = await this.uasService.emailLookup(member.email);
      const contextId = httpContext.get('loggingContext')?.correlationId || uuidv4();
      const eventData = {
        channelId: emailLookup.channelId,
        applicationStatus: status,
        contextId,
        bank: BankIdentifier.Invex,
        language: member.language
      };

      await this.uasService.pushCustomEvent(eventData);

      await this.uasService.uasAddTag({
        namedUser: memberId,
        tag,
        tagName: 'meed_status'
      });
    } catch (error) {
      console.error('push event and tag failed: ', error);
    }
  }
}
