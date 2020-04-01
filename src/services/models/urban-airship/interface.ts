export interface IUrbanAirshipService {
  uasRegisterEmailAddress(payloads: IUASRegEmail): Promise<IUASCommonResponse>;
  uasUpdateEmailChannel(payloads: IUASUpdateEmail): Promise<IUASCommonResponse>;
  uasAssociateEmailToNamedUserId(payloads: IUASAssociateEmailToNamedUserId): Promise<IUASCommonResponse>;
  uasNamedUserLookup(namedUser: string): Promise<IUASNamedUserLookupResponse>;
  uasAddInitialTags(payloads: IUASAddInitialTags): Promise<IUASCommonResponse>;
  uasAddTag(payload: IUASAddRemoveTag): Promise<IUASCommonResponse>;
  uasRemoveTag(payload: IUASAddRemoveTag): Promise<IUASCommonResponse>;
  pushInAppMessage(pushMessage: IUASPushMessage): Promise<any>;
  pushTemplateMessage(pushMessage: IUASPushMessage): Promise<any>;
  pushCustomEvent(eventData: IUASCustomEvent): Promise<any>;
  emailLookup(email: string): Promise<Partial<IUASNamedUserLookupResponse>>;
}

export interface IUASRegEmail {
  type: string;
  commercial_opted_in: string;
  address: string;
  timezone: string;
  locale_country: string;
  locale_language: string;
}

export interface IUASUpdateEmail {
  channelID: string;
  type: string;
  commercial_opted_in?: string;
  address: string;
}

export interface IUASAssociateEmailToNamedUserId {
  channel_id: string;
  device_type?: string;
  named_user_id: string;
}

export interface IUASAddInitialTags {
  namedUser: string;
  banks: string[];
}

export interface IUASAddRemoveTag {
  namedUser: string;
  tag: string;
  tagName?: string;
}

export interface IAuthHeader {
  headers: IHeaderAuthorization;
}

interface IHeaderAuthorization {
  Authorization: string;
}

export interface IUASCommonResponse {
  ok: boolean;
  channel_id?: string;
}

export interface IUASNamedUserLookupResponse {
  tags: string[];
  channelId?: string;
}

export interface IUASPushMessage {
  customerId?: string;
  channelId?: string;
  templateId?: string;
  notes?: string;
  email?: string;
  amount?: number;
  expiry?: string;
}

export interface IUASCustomEvent {
  channelId?: string;
  contextId?: string;
  applicationStatus?: string;
  bank?: string;
  language?: string;
}
