import { CommonUtils, DbSearchParams } from './../../../utils/common';
import { MemberRepository } from '../repository/member-repository';
import { IMember, ApplicationStatus, ApplicationProgress } from '../../models/meedservice/member';
import { HTTPError } from '../../../utils/httpErrors';
import { MemberErrorCodes } from '../errors/member/memberErrors';
import { IBank, IInviteValidationResult, IInviteValidationQuery } from '../../models/meedservice';
import { StaticDataService } from './static-data';

export class MemberService {
  private static memberRepository = new MemberRepository();
  constructor() {}

  //#region Business Functions

  public static async signUpEmailForOnboarding(
    email: string
  ): Promise<{ isCreated: boolean; member: IMember; bankIdentifier?: string }> {
    let member = await this.memberRepository.findOne({ email });
    if (!member) {
      member = await this.memberRepository.create({ email });
      return { isCreated: true, member };
    }
    if (
      member?.applicationProgress === ApplicationProgress.EmailVerified ||
      member?.applicationProgress === ApplicationProgress.CountrySelected
    ) {
      const memberWithBank = await this.findOne({ email: member?.email }, null, 'bank');
      return { isCreated: false, member, bankIdentifier: memberWithBank.bank?.identifier };
    }

    return { isCreated: false, member };
  }

  /**
   * This function only can validate a a inviter by email or inviterCode
   *
   * @static
   * @param {IMember} member
   * @returns {Promise<boolean>}
   * @memberof MemberService
   */
  public static async validateInviter({
    inviterEmail,
    inviterCode,
    inviter
  }: IInviteValidationQuery): Promise<IInviteValidationResult> {
    let query;

    // checking if inviterCode or email address is passed from UI
    // Otherwise we will set a default inviter
    if (inviter === 'null' || inviter === null) {
      const defaultInviterStatic = await StaticDataService.findDefaultInviterEmail();
      const defaultInviter = await this.memberRepository.findOne({
        email: defaultInviterStatic.email
      });

      return { inviterId: defaultInviter._id };
    } else if (inviterCode) {
      query = { inviterCode };
    } else if (inviterEmail) {
      query = { email: inviterEmail };
    } else {
      const { message, errorCode, httpCode } = MemberErrorCodes.INVALID_PARAMETER;
      throw new HTTPError(message, errorCode, httpCode);
    }

    const member = await this.memberRepository.findOne(query);
    if (!member || member.applicationStatus !== ApplicationStatus.Completed) {
      const { message, errorCode, httpCode } = MemberErrorCodes.INVALID_INVITER;
      throw new HTTPError(message, errorCode, httpCode);
    }

    return { inviterId: member!.id };
  }

  //#endregion

  //#region Member Crud Operations
  /**
   *  Creates a new member with the parameters that are passed in.
   *
   * @static
   * @param {IMember} member
   * @returns {Promise<IMember>}
   * @memberof MeedService
   */
  static async create(member: IMember): Promise<IMember> {
    const retVal = await this.memberRepository.create(member);
    return retVal;
  }

  /**
   *  Finds and returns a member based on the id.
   *
   * @static
   * @param {string} memberId
   * @returns {Promise<IMember>}
   * @memberof MeedService
   */
  static async findById(memberId: string): Promise<IMember> {
    const member = await this.memberRepository.findById(memberId);
    return member && (member.toJSON() as IMember);
  }

  /**
   * Return a single member based on condition like email, inviterCode or id
   *
   * @static
   * @param {object} condition
   * @returns {Promise<IMember>}
   * @memberof MemberService
   */
  static async findOne(condition: object, projection: any = null, populates: any = null): Promise<IMember> {
    const member = await this.memberRepository.findOne(condition, projection, populates);
    return member && (member.toJSON() as IMember);
  }

  /**
   *  Finds and returns a member based on some search criteria, otherwise
   *   returns all members
   *
   * @static
   * @param {string} memberId
   * @returns {Promise<IMember>}
   * @memberof MeedService
   */
  static async find(qs: string): Promise<IMember[]> {
    let search: DbSearchParams = {};

    if (qs) {
      search = CommonUtils.getDbSearchParams(qs);
    }

    return await this.memberRepository.find(search.filter, search.projection, search.sort, search.limit, search.skip);
  }

  /**
   *  Updates a member based on the fields that are passed it. It can be one or multiple
   *  fields updated at once.
   *
   * @static
   * @param {string} memberId
   * @param {IMember} member
   * @returns {(Promise<IMember | null>)}
   * @memberof MeedService
   */
  static async update(memberId: string, member: IMember): Promise<IMember | null> {
    // TODO add method documentation to all functions

    // check to see what fields are present on the object to determine business logic to perform
    // on whether to allow the update and under what conditions
    // the object should only contain those fields which are being updated

    const retVal = await this.memberRepository.findByIdAndUpdate(memberId, member);
    return retVal;
  }

  /**
   *  Removes the member from the database.
   *
   * @static
   * @param {string} memberId
   * @returns {Promise<boolean>}
   * @memberof MeedService
   */
  static async deleteMember(memberId: string): Promise<boolean> {
    const retVal = await this.memberRepository.delete(memberId);
    return retVal;
  }

  static async updateLanguage(memberId: string, language: string): Promise<any> {
    const member: IMember = await this.memberRepository.findById(memberId, 'bank');
    const locals: string[] = ((member.bank as unknown) as IBank).supportedLocales;

    if (!locals.includes(language)) {
      const { message, errorCode, httpCode } = MemberErrorCodes.LANGUAGE_NOT_SUPPORTED;
      throw new HTTPError(message, errorCode, httpCode);
    }

    const updated: IMember = await this.memberRepository.findByIdAndUpdate(memberId, { language });
    return updated;
  }
  //#endregion

  static async verifyMember(emails: string[]): Promise<string[]> {
    const members: IMember[] = await this.memberRepository.find(
      {
        email: { $in: emails },
        applicationProgress: ApplicationProgress.RegistrationCompleted,
        applicationStatus: ApplicationStatus.Completed
      },
      'email'
    );
    const validMembers = members.map(member => member.email);
    return validMembers;
  }
}
