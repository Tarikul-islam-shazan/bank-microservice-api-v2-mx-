export const mockAccessTokenResponse = {
  data: {
    access_token: 'Return when getaccessToken() called'
  }
};

export const mockUnstructuredAccountSummary = {
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

export const mockAccountSummary = [
  {
    accountId: '34D02F1758271ED9BEA912D51AF9F92A',
    accountNumber: '00000000100011184',
    accountType: 'DDA',
    currentBalance: 240.01,
    holdBalance: 0,
    availableBalance: -9.99,
    minimumDue: 0,
    creditLimitExceeded: false,
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
    interestEarned: 0,
    creditLimitExceeded: false,
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
    creditLimitExceeded: false,
    routingNumber: '103913366'
  }
];

export const mockUnstructuredTransactions = {
  Data: {
    Transaction: [
      {
        AccountId: '34D02F1758271ED9BEA912D51AF9F92A',
        TransactionId: 'ADD_A_RANDOM_STRING_HERE_121SHAHAG13',
        CreditDebitIndicator: 'Debit',
        Status: 'Pending',
        ValueDateTime: '2019-09-27T06:07:26+00:00',
        TransactionInformation: 'Account Funding  Hold',
        Amount: {
          Amount: '250.000000000',
          Currency: 'USD'
        },
        SupplementaryData: {
          Notes: [
            {
              Type: 'TerminalCity',
              Text: 'Tulsa'
            },
            {
              Type: 'TerminalState',
              Text: 'OK'
            },
            {
              Type: 'TerminalCountry',
              Text: 'US'
            }
          ]
        }
      },
      {
        AccountId: '34D02F1758271ED9BEA912D51AF9F92A',
        TransactionId: '12D51AF9F92A1EDA82E77D367B01AF3E',
        TransactionReference: '2019002000',
        CreditDebitIndicator: 'Debit',
        Status: 'Booked',
        ValueDateTime: '2019-10-28T02:17:34+00:00',
        TransactionInformation: 'Fee: Monthly',
        Amount: {
          Amount: '9.990000000',
          Currency: 'USD'
        },
        BankTransactionCode: {
          Code: 'MDOP',
          SubCode: 'FEES'
        },
        ProprietaryBankTransactionCode: {
          Code: 'DEBIT_FEE_MONTHLY',
          Issuer: 'Axxiome Banking'
        },
        DebtorAgent: {
          SchemeName: 'AXXD.BankCode',
          Identification: 'US-103913366'
        },
        DebtorAccount: {
          SchemeName: 'AXXD.AccountNumber',
          Identification: '00000000100011184',
          Name: '',
          SecondaryIdentification: 'US-103913366'
        },
        SupplementaryData: {
          Notes: [
            {
              Type: 'TerminalCity',
              Text: 'Tulsa'
            },
            {
              Type: 'TerminalState',
              Text: 'OK'
            },
            {
              Type: 'TerminalCountry',
              Text: 'US'
            }
          ]
        }
      },
      {
        AccountId: '34D02F1758271ED9BEA912D51AF9F92A',
        TransactionId: '12D51AF9F92A1EEA80D26D9F8F7E10FC',
        TransactionReference: '2019001000',
        CreditDebitIndicator: 'Debit',
        Status: 'Booked',
        ValueDateTime: '2019-09-28T01:51:20+00:00',
        TransactionInformation: 'Fee: Monthly',
        Amount: {
          Amount: '9.990000000',
          Currency: 'USD'
        },
        BankTransactionCode: {
          Code: 'MDOP',
          SubCode: 'FEES'
        },
        ProprietaryBankTransactionCode: {
          Code: 'DEBIT_FEE_MONTHLY',
          Issuer: 'Axxiome Banking'
        },
        DebtorAgent: {
          SchemeName: 'AXXD.BankCode',
          Identification: 'US-103913366'
        },
        DebtorAccount: {
          SchemeName: 'AXXD.AccountNumber',
          Identification: '00000000100011184',
          Name: '',
          SecondaryIdentification: 'US-103913366'
        },
        SupplementaryData: {
          Notes: [
            {
              Type: 'TerminalCity',
              Text: 'Tulsa'
            },
            {
              Type: 'TerminalState',
              Text: 'OK'
            },
            {
              Type: 'TerminalCountry',
              Text: 'US'
            }
          ]
        }
      },
      {
        AccountId: '34D02F1758271ED9BEA912D51AF9F92A',
        TransactionId: '12D51AF9F92A1ED9BEA926D74460B837',
        TransactionReference: 'ADD_A_RANDOM_STRING_HERE_121SHAHAG1',
        CreditDebitIndicator: 'Credit',
        Status: 'Booked',
        ValueDateTime: '2019-09-27T06:07:25+00:00',
        TransactionInformation: 'Funding by card',
        Amount: {
          Amount: '250.000000000',
          Currency: 'USD'
        },
        BankTransactionCode: {
          Code: 'OPCL',
          SubCode: 'ACCT'
        },
        ProprietaryBankTransactionCode: {
          Code: 'CREDIT_FUND_DEBIT_CARD',
          Issuer: 'Axxiome Banking'
        },
        CreditorAgent: {
          SchemeName: 'AXXD.BankCode',
          Identification: 'US-103913366'
        },
        CreditorAccount: {
          SchemeName: 'AXXD.AccountNumber',
          Identification: '00000000100011184',
          Name: 'meed.dummy string',
          SecondaryIdentification: 'US-103913366'
        },
        DebtorAgent: {
          SchemeName: 'AXXD.BankCode',
          Identification: 'US-103913366'
        },
        DebtorAccount: {
          SchemeName: 'AXXD.AccountNumber',
          Identification: '00000009000000106',
          Name: 'Meed Business Partner Internal Accounts',
          SecondaryIdentification: 'US-103913366'
        },
        SupplementaryData: {
          Notes: [
            {
              Type: 'TerminalCity',
              Text: 'Tulsa'
            },
            {
              Type: 'TerminalState',
              Text: 'OK'
            },
            {
              Type: 'TerminalCountry',
              Text: 'US'
            }
          ]
        }
      }
    ]
  }
};

export const mockTransactions = {
  postedTransactions: [
    {
      transactionType: 'Fee: Monthly',
      amount: -9.99,
      notes: 'Fee: Monthly',
      dateTime: '2019-10-28T02:17:34+00:00',
      referenceNumber: '12D51AF9F92A1EDA82E77D367B01AF3E',
      fromAccount: '00000000100011184',
      status: 'Booked',
      city: 'Tulsa',
      state: 'OK',
      country: 'US'
    },
    {
      transactionType: 'Fee: Monthly',
      amount: -9.99,
      notes: 'Fee: Monthly',
      dateTime: '2019-09-28T01:51:20+00:00',
      referenceNumber: '12D51AF9F92A1EEA80D26D9F8F7E10FC',
      fromAccount: '00000000100011184',
      status: 'Booked',
      city: 'Tulsa',
      state: 'OK',
      country: 'US'
    },
    {
      transactionType: 'Funding by card',
      amount: 250,
      notes: 'Funding by card',
      dateTime: '2019-09-27T06:07:25+00:00',
      referenceNumber: '12D51AF9F92A1ED9BEA926D74460B837',
      fromAccount: '00000009000000106',
      toAccount: '00000000100011184',
      status: 'Booked',
      city: 'Tulsa',
      state: 'OK',
      country: 'US'
    }
  ],
  pendingTransactions: [
    {
      transactionType: 'Account Funding Hold',
      amount: -250,
      notes: 'Account Funding Hold',
      dateTime: '2019-09-27T06:07:26+00:00',
      referenceNumber: 'ADD_A_RANDOM_STRING_HERE_121SHAHAG13',
      status: 'Pending',
      city: 'Tulsa',
      state: 'OK',
      country: 'US'
    }
  ]
};
