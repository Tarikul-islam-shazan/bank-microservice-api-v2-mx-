import { MemberService } from './atomic-services/member';
import {
  IMember,
  ApplicationProgress,
  IStaticData,
  IInvitation,
  IStates,
  ILoginData,
  IInviteValidationResult,
  IInviteValidationQuery,
  ITransition
} from '../models/meedservice';
import { TransitionService } from './atomic-services/transition';
import { BankAssignmentService } from './atomic-services/bankAssign';
import { HTTPError } from '../../utils/httpErrors';
import logger from '../../utils/logger';
import { StaticDataService } from './atomic-services/static-data';
import { InvitationService } from '../meedservice/atomic-services/invitation';
import { MemberErrorCodes } from './errors/member/memberErrors';
import { BankService } from './atomic-services/bank';
import { IBank } from '../models/meedservice/bank';
import { ErrorMapper } from '../../utils/error-mapper/errorMapper';
import { MeedAxios } from '../../utils/api';
import config from '../../config/config';
import { OnboardingErrorCode } from './errors/onboarding';
import { CounterService } from './atomic-services/counter';

/**
 * Holds all the functions which can be called as part of the mobile api, and which require
 * orchestration of several atomic services.
 *
 * @export
 * @class MeedService
 */
export class MeedService {
  constructor() {}

  //#region Onboarding functions
  /**
   *  This function is used as the first call to onboarding and it will look to see if the
   *  member exists and return it otherwise it will create it. So it will always return a
   *  member either existing or newly created in this call.
   *
   * @static
   * @param {string} email
   * @returns {Promise<{ isCreated: boolean; member: IMember }>}
   * @memberof MeedService
   */
  static async createOnboarding(email: string): Promise<{ member: IMember; bankIdentifier?: string }> {
    try {
      if (process.env.NODE_ENV !== 'qa' && process.env.NODE_ENV !== 'development') {
        const verifyResponse = await MeedAxios.getBriteVerifyInstance().get(
          `/?address=${email}&apikey=${config.briteVerify.key}`
        );

        if (
          verifyResponse?.data?.disposable === true ||
          verifyResponse?.data?.status === 'invalid' ||
          verifyResponse?.data?.status === 'unknown'
        ) {
          const { message, errorCode, httpCode } = OnboardingErrorCode.INVALID_EMAIL_ADDRESS;
          throw new HTTPError(message, errorCode, httpCode);
        }
      }

      const onboardingResult = await MemberService.signUpEmailForOnboarding(email);
      if (onboardingResult.isCreated) {
        await this.updateMember({
          id: onboardingResult.member.id,
          applicationProgress: ApplicationProgress.EmailRegistered
        });
      }
      const { member, bankIdentifier } = onboardingResult;

      return { member, bankIdentifier };
    } catch (err) {
      const { message, errorCode, httpCode } = ErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  // TODO: This need to be fixed to check for either email or code and implement that logic
  /**
   * Determines whether a provided email or inviterCode is valid. Validity is defined
   * as the application status being complete and registration completed.
   *
   *
   * @static
   * @param {string} email - Email of the inviter to validate
   * @param {string} inviterCode - Inviters Code to validate
   * @returns {Promise<boolean>}
   * @memberof MeedService
   */
  static async validateInviter({
    inviterEmail,
    inviterCode,
    inviter
  }: IInviteValidationQuery): Promise<IInviteValidationResult> {
    return await MemberService.validateInviter({ inviterEmail, inviterCode, inviter });
  }

  // TODO: If this becomes to complicated, need to separate into a method which is only for onboarding
  // and a second update member method for everyone else to use. The first method can then call into the
  // second one which should be more generic, and the first will only allow the 3 field from onboarding.

  static async compressedSignup(member: IMember): Promise<IMember & { identifier?: string }> {
    // check to see what fields are present on the object to determine business logic to perform
    // on whether to allow the update and under what conditions
    // the object should only contain those fields which are being updated

    // UI will only be allowed to send 'inviter' as in ObjectId to update the inviter
    // they will have already done the validation on the client which is the purpose
    // of the validate function.
    let updatedMember: IMember | null;
    let transitions = [];

    // TODO: When updating inviter, we need to make sure that we only update the inviter if current state is
    // at email signup to prevent malicious update of anyones inviter.
    const validatedInviter = await MemberService.validateInviter({
      inviterEmail: member.inviterEmail,
      inviterCode: member.inviterCode,
      inviter: member.inviter
    });

    transitions.push({
      memberId: member.id,
      status: ApplicationProgress.InviterChosen
    });

    // find a bank for this country
    const { assignedBankId, identifier } = await BankAssignmentService.assignBank(member.country);

    transitions.push({
      memberId: member.id,
      status: ApplicationProgress.CountrySelected
    });

    if (!assignedBankId) {
      // didn't find a bank but still need to update country and return an error informing
      // UI that no bank was found
      await MemberService.update(member.id, {
        inviter: validatedInviter?.inviterId,
        nickname: member.nickname,
        country: member.country,
        applicationProgress: ApplicationProgress.CountrySelected
      });

      await TransitionService.createManyOrIgnore(transitions);

      const { message, errorCode, httpCode } = MemberErrorCodes.BANK_SERVICE_NOT_AVAILABLE;
      throw new HTTPError(message, errorCode, httpCode);
    }

    updatedMember = await MemberService.update(member.id, {
      inviter: validatedInviter?.inviterId,
      nickname: member.nickname,
      country: member.country,
      bank: assignedBankId,
      applicationProgress: ApplicationProgress.BankIdentified
    });

    transitions.push({
      memberId: member.id,
      status: ApplicationProgress.BankIdentified
    });

    if (updatedMember) {
      await TransitionService.createManyOrIgnore(transitions);
    }

    // add the the bank identifier with member
    return { ...updatedMember, identifier };
  }

  /**
   * TODO Add error code for all possible errors
   *
   *  Updates a member based on the fields that are passed it. It can be one or multiple
   *  fields updated at once. For onboarding the allowed fields are
   *  - inviter - the inviter id
   *  - nickname - the nickname of the user
   *  - country - the country of the user
   *
   * @static
   * @param {string} memberId
   * @param {IMember} member
   * @returns {(Promise<IMember | null>)}
   * @memberof MeedService
   */
  static async updateMember(member: IMember): Promise<IMember | null> {
    let updatedMember: IMember | null;
    // this will handle all other genric cases of updating a member's values
    updatedMember = await MemberService.update(member.id, member);
    // if any state is being updated as well then we need to insert transitions for these
    if (member.applicationStatus || member.accountStatus || member.applicationProgress) {
      // createManyOrIgnore or createOrIgnore method already catching error
      await this.updateTransitions(member);
    }

    return updatedMember;
  }
  //#endregion

  //#region MeedService calls from other services

  /**
   * This will create transition for that status
   * if we need to create multiple transition, for example when account funded we update three status and create three transition.
   * add that logic here. Otherwise it will create single transition for that status
   *
   * @static
   * @param {string} memberId
   * @param {IMember} status
   * @memberof MeedService
   */
  static async updateTransitions(member: IMember) {
    if (member.applicationProgress === ApplicationProgress.RegistrationCompleted) {
      // registration completed
      await TransitionService.createManyOrIgnore([
        { memberId: member.id, status: ApplicationProgress.AccountFunded },
        { memberId: member.id, status: ApplicationProgress.RegistrationCompleted }
      ]);
    } else {
      // create one transition, multi transitions are already checked
      await TransitionService.createOrIgnore({ memberId: member.id, status: member.applicationProgress });
    }
  }
  //#endregion

  //#region Service calls from mobile-client only
  /**
   *  Returns static data for a given id
   *
   * @static
   * @param {string} qs The query string to match on
   * @returns {Promise<IStaticData>}
   * @memberof MeedService
   */
  static async getStaticData(qs: string): Promise<IStaticData> {
    // update member status
    // await MemberService.update(memberId, memberStatus);
    const retVal = await StaticDataService.find(qs);
    return retVal[0];
  }

  static async findMemberById(id: string): Promise<IMember> {
    const member = await MemberService.findById(id);
    return member;
  }

  static async findMemberByUsername(username: string): Promise<IMember> {
    const member = await MemberService.findOne({ username: { $regex: username, $options: 'i' } }, null, 'bank');
    return member;
  }

  static async findMemberByEmail(email: string): Promise<IMember> {
    const member = await MemberService.findOne({ email }, null, 'bank');
    return member;
  }

  static async getMembersByQuery(query): Promise<IMember[]> {
    try {
      const members = await MemberService.find(query);
      return members;
    } catch (err) {
      const { message, errorCode, httpCode } = ErrorMapper.getError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  static async getMemberWithBankPopulated(query): Promise<IMember> {
    const member = await MemberService.findOne(query, null, 'bank');
    return member;
  }

  //#endregion

  //#region MeedService invitation
  /**
   * @static
   * @param {IInvitations} invitation
   * @returns {Promise<any>}
   * @memberof MeedService
   */
  static async sendInvitation(inviter: string, invitations: IInvitation[]): Promise<IInvitation[]> {
    return await InvitationService.send(inviter, invitations);
  }

  static async verifyInvitees(invitations: IInvitation[]): Promise<IInvitation[]> {
    return await InvitationService.verifyInvitees(invitations);
  }
  /**
   * Get inivitation list of a loggedin user
   * @static
   * @param {string} memberId
   * @returns {Promise<IInvitation[]>}
   * @memberof MeedService
   */
  static async getInvitationList(memberId: string): Promise<IInvitation[]> {
    return await InvitationService.list(memberId);
  }

  //#endregion

  /**
   * @static
   * @param {string} bankId
   * @param {*} populates
   * @returns {Promise<IBank>}
   * @memberof MeedService
   */
  static async findABankById(bankId: string, populates: any): Promise<IBank> {
    return await BankService.findOne({ _id: bankId }, populates);
  }
  /**
   * Get all states of a country with countryId
   * From StaticData Collection
   *
   * @static
   * @param {string} countryId
   * @returns {Promise<IStates[]>}
   * @memberof MeedService
   */
  static async getAllStates(countryId: string): Promise<IStates[]> {
    const query = `category=states&subCategory=${countryId}`;
    const statesRes = await StaticDataService.find(query);
    const states = statesRes[0].data.states;

    return states;
  }

  /**
   * Find member by username and populate bank and return
   * And Get Static Data By Bank ID
   *
   * @static
   * @param {string} username
   * @returns {Promise<IMember>}
   * @memberof MeedService
   */
  static async getLoginData(username: string): Promise<ILoginData> {
    try {
      const member = await MemberService.findOne(
        { username: { $regex: username, $options: 'i' } },
        null,
        'bank inviter'
      );

      if (!member) {
        const { message, errorCode, httpCode } = MemberErrorCodes.MEMBER_NOT_FOUND;
        throw new HTTPError(message, errorCode, httpCode);
      }

      const staticData = await StaticDataService.findByBankId(member.bank && member.bank._id);
      return { member, staticData };
    } catch (error) {
      if (error instanceof HTTPError) {
        throw error;
      }
      const { message, errorCode, httpCode } = ErrorMapper.getError(error);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  static UILogger(logData: any): void {
    logger.info('{}', { ...logData });
  }

  static async updateEmail(memberId: string, newEmail: string): Promise<IMember> {
    const { email, priorEmails } = await MeedService.findMemberById(memberId);
    priorEmails.push(email);
    const member = await MemberService.update(memberId, { email: newEmail, priorEmails });
    return member;
  }

  static async addTransitions(transitions: ITransition[]): Promise<void> {
    await TransitionService.createManyOrIgnore(transitions);
  }

  static async generateCustomerId(): Promise<string> {
    const counter = await CounterService.getCounter('customerId');
    // TODO: need to check if any condition or padding length required
    const customerId = counter.toString().padStart(11, '0');
    return customerId;
  }
}
