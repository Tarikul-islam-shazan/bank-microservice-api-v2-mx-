// TODO: all the mock should be in shareable mock files to use in another services

export const mockAccessTokenResponse = {
  data: {
    access_token: 'Return when getaccessToken() called'
  }
};

export const mockLogin = {
  username: 'meed.dummy',
  password: 'ebf7718e7517e6a4fa2aee9ef05421a4c0b18a62b3ba6c98a82e179309907b43'
};

export const mockCountry = {
  _id: '5ab159487fabb066abb60025',
  countryAbv: 'USA',
  countryName: 'United States of America',
  createdDate: '2018-11-16 08:32:15.629',
  updatedDate: '2018-11-16 08:32:15.629',
  unitOfMeasure: 'Imperial'
};

export const mockBank = {
  _id: '5c17349a8ca47446b6103696',
  updatedDate: '2018-12-16T23:10:16.662Z',
  createdDate: '2018-12-16T23:04:36.228Z',
  country: '5ab159487fabb066abb60025',
  currency: 'USD',
  bankApiUrl: 'http://vnb.net/',
  bankShortName: 'USA001',
  bankName: 'Valley National Bank',
  socialBoostMultiplier: 0,
  communicationsOptedIn: false,
  useBankInviter: false,
  bankInviter: 'globalcommunity@meed.net',
  securityQuestions: {
    number: [1, 2, 3, 4, 5, 6]
  },
  supportedLocales: ['en_US', 'es_MX'],
  banksSharingAtms: [],
  identifier: 'axiomme'
};

export const mockMember = {
  _id: '5da410f9801f2742a236c988',
  id: '5da4104f801f2742a236c986',
  applicationStatus: 'application-completed',
  applicationProgress: 'registration-completed',
  accountStatus: 'account-opened',
  language: 'en_US',
  email: 'meed.dummy@yopmail.com',
  nickName: 'John Doe',
  bank: mockBank,
  country: '5ab159487fabb066abb60025',
  username: 'meed.dummy',
  nickname: 'John Doe',
  customerId: '0000006569',
  inviter: '5da841595a519a499497e18b'
};

export const mockStaticData = [
  {
    _id: '5c346a4500f5b6b77d8b8ff4',
    subCategory: 'en_US',
    category: 'SuppressFeature',
    data: {
      Menu: {
        Home: false,
        InviteUsers: false,
        CheckDeposit: false,
        ATM: false,
        AccountManagement: false,
        AccountInformation: false,
        Payments: false,
        SocialBoost: false,
        Settings: false,
        PrivacyPolicy: false,
        ContactUs: false,
        Alerts: false,
        MsgCenter: false,
        Statements: false,
        Rewards: true,
        Insurance: true,
        AppMap: true,
        Credit: false,
        MeedExtras: false
      },
      ATM: {
        ATMList: false,
        ATMMap: false
      },
      SocialBoost: {
        MyGrowth: false,
        MeedGrowth: false,
        MyRank: false
      },
      AccountManagement: {
        Personal: false,
        MyCard: false
      },
      Personal: {
        Address: false,
        Email: false,
        Password: false,
        Pin: false
      },
      AccountInformation: {
        AccountDetail: false,
        Statements: false
      },
      Payments: {
        P2P: false,
        TopUp: true,
        InterBank: false,
        CheckDeposit: false,
        BillPay: false,
        CardSwap: false,
        InternalTransfer: false
      },
      P2P: {
        SendMoney: false,
        UsersList: false,
        RequestMoney: false
      },
      InterBank: {
        NewTransfer: false,
        ManageBeneficiary: false,
        ScheduledTransfer: false
      },
      InternalTransfer: {
        NewTransfer: false,
        ScheduledTransfer: false
      },
      InviteUsers: {
        InviteUsers: false,
        TrackUser: false
      },
      Rewards: {
        Mobifone: true,
        Joy: true,
        Toi: true
      }
    }
  }
];

export const mockRegNotCompleted = {
  ...mockMember,
  configurationData: mockStaticData
};

export const mockAccountSummary = [
  {
    accountId: '34D02F1758271ED9BEA912D51AF9F92A',
    accountNumber: '00000000100011184',
    accountType: 'DDA',
    currentBalance: 240.01,
    holdBalance: 0,
    availableBalance: -9.99,
    minimumDue: 0,
    routingNumber: '103913366'
  },
  {
    accountId: '34D03A1738271ED9BEA912D51AF9F92A',
    accountNumber: '00000000100011193',
    accountType: 'SSA',
    currentBalance: 250,
    holdBalance: 0,
    availableBalance: 0,
    minimumDue: 0,
    routingNumber: '103913366'
  },
  {
    accountId: '4094B91718271ED9BEA912D51AF9F92A',
    accountNumber: '00000000100011205',
    accountType: 'LOC',
    balanceOwed: 0,
    currentBalance: 0,
    holdBalance: 0,
    availableBalance: 0,
    minimumDue: 0,
    routingNumber: '103913366'
  }
];

export const mockRegCompleted = {
  ...mockRegNotCompleted,
  accountSummary: mockAccountSummary
};

export const mockPreAccountSummary = {
  Data: {
    Account: [
      {
        AccountId: '34D02F1758271ED9BEA912D51AF9F92A',
        Currency: 'USD',
        AccountType: 'Personal',
        AccountSubType: 'DDA',
        Status: 'Active',
        Balance: [
          {
            Type: 'currentBalance',
            Amount: {
              Amount: '240.010000000',
              Currency: 'USD'
            }
          },
          {
            Type: 'availableBalance',
            Amount: {
              Amount: '-9.99',
              Currency: 'USD'
            }
          },
          {
            Type: 'holdBalance',
            Amount: {
              Amount: '0.00',
              Currency: 'USD'
            }
          }
        ],
        Account: [
          {
            SchemeName: 'AXXD.AccountNumber',
            Identification: '00000000100011184',
            SecondaryIdentification: 'US-103913366',
            Name: ''
          }
        ],
        Nickname: '',
        AccessLimit: [
          {
            LimitCounter: 0,
            ActualCounter: 0,
            DateTime: ''
          }
        ]
      },
      {
        AccountId: '34D03A1738271ED9BEA912D51AF9F92A',
        Currency: 'USD',
        AccountType: 'Personal',
        AccountSubType: 'SAV',
        Status: 'Active',
        Balance: [
          {
            Type: 'currentBalance',
            Amount: {
              Amount: '250.000000000',
              Currency: 'USD'
            }
          },
          {
            Type: 'availableBalance',
            Amount: {
              Amount: '0.0',
              Currency: 'USD'
            }
          }
        ],
        Account: [
          {
            SchemeName: 'AXXD.AccountNumber',
            Identification: '00000000100011193',
            SecondaryIdentification: 'US-103913366',
            Name: ''
          }
        ],
        AccessLimit: [
          {
            Type: 'MonthlyCounterLimit',
            LimitCounter: 6,
            ActualCounter: 0,
            DateTime: '',
            ActualAmount: {
              Amount: null,
              Currency: null
            },
            LimitAmount: {
              Amount: null,
              Currency: null
            }
          }
        ],
        Nickname: ''
      },
      {
        AccountId: '4094B91718271ED9BEA912D51AF9F92A',
        Currency: 'USD',
        AccountType: 'Personal',
        AccountSubType: 'LOC',
        Status: 'Active',
        Balance: [
          {
            Type: 'currentBalance',
            Amount: {
              Amount: '0.0',
              Currency: 'USD'
            }
          },
          {
            Type: 'availableBalance',
            Amount: {
              Amount: '0.0',
              Currency: 'USD'
            }
          },
          {
            Type: 'balanceOwed',
            Amount: {
              Amount: '0.0',
              Currency: 'USD'
            }
          },
          {
            Type: 'MinimumExpected',
            Amount: {
              Amount: '0.000000000',
              Currency: 'USD'
            }
          }
        ],
        Account: [
          {
            SchemeName: 'AXXD.AccountNumber',
            Identification: '00000000100011205',
            SecondaryIdentification: 'US-103913366',
            Name: ''
          }
        ],
        Nickname: ''
      }
    ]
  }
};
