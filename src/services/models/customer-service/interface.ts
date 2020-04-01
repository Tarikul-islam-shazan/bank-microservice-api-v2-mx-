import { IBankService } from '../shared/interface';

export interface ICustomerService extends IBankService {
  customerInfo(memberId: string): Promise<Customer>;
  updateCustomerInfo(req: Customer, files: any, memberId: any, customerId: any): Promise<OtpResponse | Customer>;
  updateContactPreference(req: any): Promise<OtpResponse | ContactPreference>;
  getContactPreference(): Promise<ContactPreference>;
  getPrivacyAndLegal(): Promise<IPrivacyAndLegalDocument[]>;
}

export interface Customer {
  salutation?: string;
  firstName?: string;
  middleName?: string;
  nickname?: string;
  oldName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  stateName?: string;
  zipCode?: number;
  mobilePhone?: number;
  workPhone?: number;
  otpID?: string;
  otpToken?: number;
  reason?: string;
  requiredDocument?: string;
}

export interface ContactPreference {
  status: boolean;
  type: string;
}

export interface OtpResponse {
  httpCode: number;
  message: string;
  code: number;
  otpID?: string;
}

export interface EmailChangeReq {
  Data: {
    Party: {
      email: string;
    };
  };
}

export interface AddressChangeReq {
  Data: {
    Party: {
      Address: {
        AddressType: null;
        AddressLine: [string];
        PostCode: number;
        TownName: string;
        CountrySubdivision: string;
        Country: string;
      };
    };
  };
}

export interface ContactNumberChangeReq {
  Data: {
    Party: {
      Phone: number;
      Mobile: number;
    };
  };
}

export interface NameChangeReq {
  Data: {
    Party: {
      PartyType: string;
      Salutation: string;
      FirstName: string;
      MiddleName: string;
      LastName: string;
      DateOfBirth: string;
    };
  };
}

export interface ContactPreferenceReq {
  Data: {
    Party: {
      CommunicationPreference: {
        CommunicationType: string;
        AdvertisingAllowed: string;
      };
    };
  };
}

export interface IPrivacyAndLegalDocument {
  title: string;
  pdf: string;
}
