import moment from 'moment';

import { InvitationRepository } from '../repository/invitation-repository';
import { IInvitation, InvitationStatus } from '../../models/meedservice';
import { SendGrid, ISendGridTemplate } from '../../../utils/sendgrid/sendGridHelper';
import { MemberService } from './member';
import { InvitationErrMapper } from '../errors/invitation/error';
import { HTTPError } from '../../../utils/httpErrors';

export class InvitationService {
  private static invitationRepository = new InvitationRepository();
  constructor() {}

  /**
   * Return a single invitation based on condition like inviteesEmail, memeber id etc
   *
   * @static
   * @param {object} condition
   * @returns {Promise<IMember>}
   * @memberof MemberService
   */
  static async findOne(condition: object): Promise<IInvitation> {
    const retVal = await this.invitationRepository.findOne(condition);
    return retVal as IInvitation;
  }

  /**
   * @static
   * @param {object} condition
   * @returns {Promise<IInvitation[]>}
   * @memberof InvitationService
   */
  static async find(condition?: object, projection?: any): Promise<IInvitation[]> {
    const retVal = await this.invitationRepository.find(condition, projection);
    return retVal as IInvitation[];
  }

  /**
   * @static
   * @param {string} memberId
   * @returns {Promise<IInvitation[]>}
   * @memberof InvitationService
   */
  static async list(memberId: string): Promise<IInvitation[]> {
    const inList = await this.find({ inviter: memberId }, [
      '-_id',
      'inviter',
      'status',
      'inviteeEmail',
      'message',
      'language',
      'expirationDate',
      'createdDate'
    ]);
    return inList as IInvitation[];
  }

  static async verifyInvitees(invitations: IInvitation[]): Promise<IInvitation[]> {
    const inviteeEmails = invitations.map(invitation => invitation.inviteeEmail);
    const members = await MemberService.find(`email=${inviteeEmails.toString()}&fields=email`);

    return members.map(member => {
      return { inviteeEmail: member.email };
    });
  }

  /**
   * Send inviation
   * @static
   * @param {IInvitations} invitation
   * @returns {Promise<object[]>}
   * @memberof InvitationService
   */
  static async send(inviter: string, invitations: IInvitation[]): Promise<IInvitation[]> {
    try {
      const allInvitations: IInvitation[] = invitations.map(invitation => {
        invitation.status = InvitationStatus.Sent;
        invitation.inviter = inviter;
        invitation.expirationDate = moment()
          .add(1, 'M')
          .valueOf();

        return invitation;
      });

      const invited = await this.invitationRepository.model.create(allInvitations);
      await this.sendInviteEmail(inviter, invited);
      return invited;
    } catch (err) {
      const { message, errorCode, httpCode } = InvitationErrMapper.sendGridError(err);
      throw new HTTPError(message, errorCode, httpCode);
    }
  }

  /**
   * @static
   * @param {IInvitations} invitation
   * @param {IInvitation} savedInvitation
   * @returns {Promise<any>}
   * @memberof InvitationService
   */
  static async sendInviteEmail(inviter: string, allInvitations: IInvitation[]): Promise<any> {
    const member = await MemberService.findById(inviter as string);
    const emailConfig = SendGrid.getConfigByLanguage();

    const emailTemplate: ISendGridTemplate = {
      sender: member.email,
      receiver: allInvitations.map(invitee => invitee.inviteeEmail)
    };

    const templateData: any = {
      YEAR: new Date().getFullYear(),
      KONY_HANDOFF_URL: emailConfig.inviationEmailUrl,
      INVITATION_TOKEN: (allInvitations[0] as any)._id,
      username: member.email
    };

    templateData.REFERRED_BY = member.email;
    templateData.INVITATION_MESSAGE = allInvitations[0].message;
    templateData.username = member.email;
    emailTemplate.templateId = emailConfig.templates.Referral_NoGraph.id;
    emailTemplate.groupID = emailConfig.templates.Referral_NoGraph.groupID;
    emailTemplate.subscribeLink = emailConfig.templates.Referral_NoGraph.withUnsubscribeLink;

    emailTemplate.templateData = templateData;

    const emailResponse = await SendGrid.sendWithTemplate(emailTemplate);
    return emailResponse;
  }
}
