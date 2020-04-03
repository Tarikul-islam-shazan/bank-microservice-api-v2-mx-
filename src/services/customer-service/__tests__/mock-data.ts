import { BankIdentifier } from '../../../interfaces/MeedRequest';

const mockCustomer = {
  nickname: 'Jon Snow',
  salutation: 'MR',
  firstName: 'Meed',
  middleName: 'Banking',
  lastName: 'Test',
  email: 'meed.test.mock@yopmail.com',
  dateOfBirth: '1978-11-11',
  address: '2038 E AMERICAN BLVD',
  city: 'BLOOMINGTON',
  state: 'AL',
  zipCode: '55425',
  country: 'US',
  mobilePhone: '+14242784242'
};

const UpdateName = {
  oldName: `${mockCustomer.firstName} ${mockCustomer.middleName} ${mockCustomer.lastName}`,
  reason: 'Legal name misspelling on your account',
  requiredDocument: 'Birth certificate'
} as any;

['salutation', 'firstName', 'middleName', 'lastName', 'dateOfBirth', 'email'].forEach(field => {
  UpdateName[field] = mockCustomer[field];
});

const UpdateEmail = {
  email: mockCustomer.email
};

const UpdateAddress = {};
['address', 'city', 'state', 'zipCode'].forEach(field => {
  UpdateAddress[field] = mockCustomer[field];
});

const UpdateContactNumber = {
  mobilePhone: mockCustomer.mobilePhone,
  workPhone: mockCustomer.mobilePhone
};

const UpdateNickName = {
  nickname: mockCustomer.nickname
};

const UpdateContactPreference = {
  status: false,
  type: 'push'
};

const errWithOtp = {
  response: {
    status: 403,
    headers: {
      'axxd-otp-id': '0bbb95f1-a332-47d5-81fc-7c4f81e0bbd6'
    },
    data: {
      message: 'Additional Otp required'
    }
  }
};

const updateNameFiles = {
  reason: 'As I wish',
  frontIdImage: '',
  backIdImage: '',
  documentImage: '',
  requiredDocument: ''
};

const updateContactHeaders = {
  'meedbankingclub-bank-identifier': BankIdentifier.Invex,
  'meedbankingclub-username': 'meed.test',
  'meedbankingclub-memberid': '5ddd08de9788d43f6f55c075'
};

const updateCustomerHeaders = {
  ...updateContactHeaders,
  'meedbankingclub-customerid': '0000006991'
};

const otpHeaders = {
  'meedbankingclub-otp-id': '0bbb95f1-a332-47d5-81fc-7c4f81e0bbd6',
  'meedbankingclub-otp-token': '821504'
};

const mockInfo = {
  data: {
    Data: {
      Party: {
        PartyId: '0000006991',
        PartyNumber: '0000006991',
        PartyType: 'Sole',
        Salutation: 'MR',
        FirstName: 'Meed',
        MiddleName: 'Banking',
        LastName: 'Test',
        NickName: 'meed.test',
        TIN: '127083741',
        DateOfBirth: '1978-11-11',
        EmailAddress: 'meed.test.mock@yopmail.com',
        Mobile: '+14242784242',
        Identification: [
          {
            Type: 'DriversLicense',
            Number: 'M121000000095',
            Country: 'US',
            CountrySubdivision: 'AL',
            Issuer: 'AL'
          }
        ],
        CommunicationPreference: [
          {
            CommunicationType: 'EMAIL',
            AdvertisingAllowed: 'OFF'
          },
          {
            CommunicationType: 'SMS',
            AdvertisingAllowed: 'OFF'
          },
          {
            CommunicationType: 'PUSH',
            AdvertisingAllowed: 'OFF'
          }
        ],
        Address: {
          AddressType: 'Business',
          AddressLine: ['2038 E AMERICAN BLVD'],
          PostCode: '55425',
          TownName: 'BLOOMINGTON',
          CountrySubdivision: 'AL',
          Country: 'US'
        },
        Financials: {
          Occupation: {
            Industry: 'ManagementBusinessFinancial',
            Since: '2016-01-01',
            Until: '2018-01-15'
          },
          DueDiligence: {
            IncomeSource: 'SalaryWages',
            MonthlyWithdraw: '0-1T',
            MonthlyDeposit: '0-1T'
          }
        }
      }
    },
    nickname: 'Jon Snow'
  }
};

export {
  mockCustomer,
  UpdateName,
  UpdateAddress,
  UpdateEmail,
  UpdateContactNumber,
  UpdateNickName,
  UpdateContactPreference,
  errWithOtp,
  otpHeaders,
  updateNameFiles,
  updateContactHeaders,
  updateCustomerHeaders,
  mockInfo
};
