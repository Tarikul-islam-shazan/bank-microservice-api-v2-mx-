import { IMember } from './member';

export interface IInvitation {
  inviter?: string | IMember;
  language?: string;
  inviteeEmail?: string;
  message?: string;
  status?: InvitationStatus;
  expirationDate?: any;
}

export enum InvitationStatus {
  Sent = 'SENT',
  Read = 'READ',
  Applied = 'APPLIED',
  Failed = 'FAILED',
  FromMember = 'FROM_MEMBER'
}

export interface IInviteValidationQuery {
  inviterEmail?: string;
  inviterCode?: string;
  inviter?: string | null;
}

export interface IInviteValidationResult {
  inviterId: string;
}
