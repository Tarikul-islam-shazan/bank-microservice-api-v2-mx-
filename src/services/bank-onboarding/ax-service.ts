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
  MxMemberInfo,
  IScannedIdData,
  TncResponse,
  IGeneralInfo,
  IAddressInfo,
  IBeneficiaryInfo,
  IGovDisclosure,
  IFundProvider,
  AccountSelection,
  IPersonalInfo
} from '../models/bank-onboarding/interface';
import { IMember, AccountStatus } from '../models/meedservice/member';
import { HTTPError } from '../../utils/httpErrors';
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
import { IUrbanAirshipService } from '../models/urban-airship/interface';
import httpContext from 'express-http-context';
import uuidv4 from 'uuid/v4';
import { AccountType } from '../models/account-service/interface';
import { IvxOnboardErrMapper } from './errors/ivx-onboard-errors';

@injectable()
export class IvxOnboardingService implements IOnboardingService {
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

  async createLogin(credential: Credential): Promise<string> {
    const customerId = await MeedService.generateCustomerId();
    // const headers = await this.auth.getBankHeaders(); // without auth its working!
    const apiBody = RequestMapper.createLogin(customerId, credential);
    const response = await MeedAxios.getInvexInstance().post(``, { ...apiBody });

    // we are expecting always 200 code, so we no longer need try catch
    // axios error / http error will be handled by async wrapper
    IvxOnboardErrMapper.createLogin(response.data);

    return customerId;
  }

  //#region apply for account
  /**
   * This method will create an account id if this is successful, otherwise it may gives some identity verification question
   * If user drop off from identity verification and need to fetch identity verification question again please call 'getIdentityQuestions'
   * to fetch the questions again
   *
   * @param {string} memberId
   * @param {BankApplication} application
   * @returns {(Promise<IMember>)}
   * @memberof IvxOnboardingService
   * @version v1.0.0
   */
  async generalInformation(memberId: string, generalInfo: IGeneralInfo): Promise<IMember> {
    // TODO: Hove to call invex bank api with generalInfo
    // Now returning demo data for now

    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.GeneralInfoCompleted
      // applicationStatus: ApplicationStatus.Denied
    });

    return { ...member, generalInfo } as any;
  }

  async beneficiaryInformation(memberId: string, beneficiaryInfo: IBeneficiaryInfo): Promise<IMember> {
    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.BeneficiaryInfoCompleted
      // applicationStatus: ApplicationStatus.Denied
    });

    return { ...member, beneficiaryInfo } as any;
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
   * @memberof IvxOnboardingService
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
   * @memberof IvxOnboardingService
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

  /**
   * TODO: complete after getting mexico bank api's
   *
   * @param {string} memberId
   * @param {IAddressInfo} addressInfo
   * @returns {Promise<IMember>}
   * @memberof IvxOnboardingService
   */
  async addressInfo(memberId: string, addressInfo: IAddressInfo): Promise<IMember> {
    // const apiBody = RequestMapper.addressInfo(addressInfo);

    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.AddressInfoCompleted
    });

    return member;
  }

  /**
   * TODO: complete using invex bank api's
   *
   * @param {string} memberId
   * @param {AccountSelection} accountLevel
   * @returns {Promise<IMember>}
   * @memberof IvxOnboardingService
   */
  async selectAccountLevel(memberId: string, accountLevel: AccountSelection): Promise<IMember> {
    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.AccountLevelSelected
    });

    return member;
  }

  /**
   * TODO: complete using invex bank api's
   *
   * @param {string} memberId
   * @param {IPersonalInfo} personalInfo
   * @returns {Promise<IMember>}
   * @memberof IvxOnboardingService
   */
  async personalInformation(memberId: string, personalInfo: IPersonalInfo): Promise<IMember> {
    // TODO: Have to update with invex api
    // This is just for demo

    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.PersonalInfoCompleted
      // applicationStatus: ApplicationStatus.Denied
    });

    return { ...member, personalInfo } as any;
  }

  /**
   * TODO: complete using invex bank api's
   *
   * @param {string} memberId
   * @param {IGovDisclosure} govDisclosure
   * @returns {Promise<IMember>}
   * @memberof IvxOnboardingService
   */
  async govDisclosureInfo(memberId: string, govDisclosure: IGovDisclosure): Promise<IMember> {
    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.GovDisclosureCompleted
      // applicationStatus: ApplicationStatus.Denied
    });

    return { ...member, govDisclosure } as any;
  }

  /**
   * TODO: complete using invex bank api's
   *
   * @param {string} memberId
   * @param {IFundProvider} funding
   * @returns {Promise<IMember>}
   * @memberof IvxOnboardingService
   */
  async fundProvider(memberId: string, funding: IFundProvider): Promise<IMember> {
    const member = await MeedService.updateMember({
      id: memberId,
      applicationProgress: ApplicationProgress.FundSourceInfoCompleted
    });

    return member;
  }
}
