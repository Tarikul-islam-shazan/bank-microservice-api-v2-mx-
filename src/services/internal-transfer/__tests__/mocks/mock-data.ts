import moment from 'moment';
import { TransferFrequency } from '../../../models/internal-transfer/interface';

export const mockAccessTokenResponse = {
  data: {
    access_token: 'Return when getaccessToken() called'
  }
};

const today = moment().format();
const nextMonth = moment(today)
  .add(1, 'month')
  .format();

export const mockAccounts = {
  DDA: {
    accountId: '9423FF655D821ED9BEFA12D51AF9F92A',
    accountNumber: '00000000100012453',
    accountType: 'DDA',
    currentBalance: 610,
    holdBalance: 0,
    availableBalance: 10,
    minimumDue: 0,
    routingNumber: '103913366'
  },
  SAV: {
    accountId: '94240A659D821ED9BEFA12D51AF9F92A',
    accountNumber: '00000000100012462',
    accountType: 'SAV',
    currentBalance: 610,
    holdBalance: 0,
    availableBalance: 583.33,
    minimumDue: 0,
    routingNumber: '103913366'
  },
  LOC: {
    accountId: '942415653D821ED9BEFA12D51AF9F92A',
    accountNumber: '00000000100012471',
    accountType: 'LOC',
    balanceOwed: 20,
    currentBalance: 427,
    holdBalance: 0,
    availableBalance: 407,
    minimumDue: 0,
    routingNumber: '103913366'
  }
};

export const insufficientError = {
  code: '801',
  message: 'Insufficient balance'
};

export const paymentDateError = {
  code: '422',
  message: 'FirstPaymentDate can not be before current date'
};

export const mockRequest = {
  creditorAccount: mockAccounts.DDA.accountId,
  debtorAccount: mockAccounts.LOC.accountId,
  amount: 10.0,
  currency: 'USD',
  frequency: TransferFrequency.Once
};

export const mockImmediate = {
  request: {
    ...mockRequest,
    notes: 'Mock Immediate note',
    transferDate: today
  },
  response: {
    data: {
      Data: {
        DomesticPaymentId: '12D51AF9F92A1EEA808F17AEA2302B48'
      }
    }
  }
};

export const mockSchedule = {
  request: {
    ...mockRequest,
    notes: 'Mock schedule note',
    transferDate: nextMonth
  },
  response: {
    data: {
      Data: {
        DomesticScheduledPaymentId: '000000022565-MD01'
      }
    }
  }
};

export const mockWeekly = {
  request: {
    ...mockRequest,
    notes: 'Mock recurring weekly note',
    frequency: TransferFrequency.Weekly,
    transferDate: nextMonth
  },
  response: {
    data: {
      Data: {
        DomesticStandingOrderId: '942415653D821ED9BEFA12D51AF9F92A-0000000001'
      }
    }
  }
};

export const mockMonthly = {
  request: {
    ...mockRequest,
    notes: 'Mock recurring monthly note',
    frequency: TransferFrequency.Monthly,
    transferDate: nextMonth
  },
  response: {
    data: {
      Data: {
        DomesticStandingOrderId: '942415653D821ED9BEFA12D51AF9F92A-0000000002'
      }
    }
  }
};

export const mockYearly = {
  request: {
    ...mockRequest,
    notes: 'Mock recurring yearly note',
    frequency: TransferFrequency.Yearly,
    transferDate: nextMonth
  },
  response: {
    data: {
      Data: {
        DomesticStandingOrderId: '942415653D821ED9BEFA12D51AF9F92A-0000000003'
      }
    }
  }
};

export const mockScheduleList = {
  data: {
    Data: {
      DomesticScheduledPayments: [
        {
          DomesticScheduledPaymentId: '000000022708-MD01',
          ConsentId: null,
          CreationDateTime: '2019-11-11T02:49:28.000-06:00',
          Status: 'InitiationPending',
          StatusUpdateDateTime: '2019-11-11T02:49:28.000-06:00',
          ExpectedExecutionDateTime: null,
          ExpectedSettlementDateTime: null,
          Charges: {
            Amount: null,
            Currency: null
          },
          Initiation: {
            InstructionIdentification: null,
            EndToEndIdentification: null,
            LocalInstrument: null,
            RequestedExecutionDateTime: '2019-12-21T00:00:00.000-06:00',
            InstructedAmount: {
              Amount: 10,
              Currency: 'USD'
            },
            DebtorAccount: {
              SchemeName: 'AXXD.INTERNAL_ID',
              Identification: '4094B91718271ED9BEA912D51AF9F92A',
              Name: 'meed.dummy string',
              SecondaryIdentification: null
            },
            CreditorAccount: {
              SchemeName: 'AXXD.AccountNumber',
              Identification: '00000000100011184',
              SecondaryIdentification: 'US-103913366',
              Name: 'meed.dummy string'
            },
            CreditorPostalAddress: {
              AddressType: null,
              Department: null,
              SubDepartment: null,
              StreetName: null,
              BuildingNumber: null,
              PostCode: null,
              TownName: null,
              CountrySubDivision: null,
              Country: null,
              AddressLine: []
            },
            RemittanceInformation: {
              Unstructured: null,
              Reference: null
            },
            SupplementaryData: {
              Notes: [
                {
                  Type: '',
                  Text: 'from postman'
                }
              ]
            }
          },
          Administrative: {
            ProcessId: null
          },
          Message: {
            Type: null,
            Code: null,
            Content: []
          }
        }
      ]
    }
  }
};

export const mockRecurList = {
  data: {
    Data: {
      DomesticStandingOrders: [
        {
          DomesticStandingOrderId: '4094B91718271ED9BEA912D51AF9F92A-0000000001',
          ConsentId: null,
          CreationDateTime: '2019-11-11T03:02:44.953-06:00',
          Status: 'InitiationCompleted',
          StatusUpdateDateTime: '2019-11-11T03:02:44.953-06:00',
          Initiation: {
            Frequency: 'Weekly',
            Reference: null,
            NumberOfPayments: null,
            FirstPaymentDateTime: '2019-12-23T00:00:00.000-06:00',
            FirstPaymentAmount: null,
            RecurringPaymentDateTime: null,
            RecurringPaymentAmount: {
              Amount: '10.000000000',
              Currency: 'USD'
            },
            FinalPaymentDateTime: '2021-11-13T00:00:00.000-06:00',
            FinalPaymentAmount: null,
            DebtorAccount: {
              SchemeName: 'AXXD.INTERNAL_ID',
              Identification: '4094B91718271ED9BEA912D51AF9F92A',
              Name: null,
              SecondaryIdentification: null
            },
            CreditorAccount: {
              SchemeName: 'AXXD.AccountNumber',
              Identification: '00000000100011184',
              Name: 'meed.dummy string',
              SecondaryIdentification: 'US-103913366'
            },
            SupplementaryData: {
              Notes: [
                {
                  Type: null,
                  Text: 'from postman'
                }
              ]
            }
          },
          Message: null,
          Charges: null
        }
      ]
    }
  }
};

export const mockTransferList = [
  {
    amount: '10.000000000',
    transferDate: '2019-12-23T00:00:00.000-06:00',
    debtorAccount: '4094B91718271ED9BEA912D51AF9F92A',
    creditorAccount: '00000000100011184',
    notes: 'from postman',
    frequency: 'Weekly',
    transferId: '4094B91718271ED9BEA912D51AF9F92A-0000000001',
    currency: 'USD',
    transferType: 'Recurring'
  },
  {
    amount: 10,
    transferDate: '2019-12-21T00:00:00.000-06:00',
    debtorAccount: '4094B91718271ED9BEA912D51AF9F92A',
    creditorAccount: '00000000100011184',
    notes: 'from postman',
    frequency: 'Once',
    transferId: '000000022708-MD01',
    currency: 'USD',
    transferType: 'Scheduled'
  }
];

export const makeMockError = ErrorCode => ({
  response: {
    data: {
      Data: {
        Error: [
          {
            ErrorCode
          }
        ]
      }
    }
  }
});
