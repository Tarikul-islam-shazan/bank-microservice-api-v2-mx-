export interface IContact {
  email?: string;
  contactType?: ContactType;
}

export interface IPayContact extends IContact {
  name?: string;
  nickName?: string;
  phone?: string;
  sharedSecret?: string;
  customerId?: string;
  status?: string;
  otpId?: string;
}

export interface IMeedContact extends IContact {
  belongTo?: string;
}

export enum ContactType {
  MEED = 'MEED',
  IPAY = 'IPAY'
}
