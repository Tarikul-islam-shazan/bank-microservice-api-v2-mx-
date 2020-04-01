export const addPayeeResponse = `{
  "payeeId": Data.Payee.PayeeId,
  "fullName": Data.Payee.FullName,
  "phone": Data.Payee.Phone,
  "type": Data.Payee.PayeeType,
  "street": Data.Payee.Addresses.StreetName,
  "postCode": Data.Payee.Addresses.PostCode,
  "city": Data.Payee.Addresses.TownName,
  "state": Data.Payee.Addresses.CountrySubDivision,
  "accountNumber": Data.Payee.PayeeAccounts.Account.Identification,
  "paymentMethodType": Data.PayeeDetails.PaymentMethodType,
  "firstAvailableProcessDate": Data.PayeeDetails.FirstAvailableProcessDate
}`;

export const addPayeeRequest = `{
  "Data": {
    "Payee": {
      "FullName": fullName,
      "Nickname": nickName,
      "Phone": phone,
      "PayeeType": type,
      "PaymentIntentionType": "BillPayment",
      "Addresses": [
        {
          "StreetName": street,
          "BuildingNumber": "",
          "PostCode": postCode,
          "TownName": city,
          "CountrySubDivision": state,
          "Country": ""
        }
      ],
      "PayeeAccounts": [
        {
          "AccountId": "",
          "AccountType": type = 'Individual' ? 'Personal' : 'Business',
          "AccountSubType": "CurrentAccount",
          "Account": {
            "SchemeName": "AXXD.AccountNumber",
            "Identification": accountNumber,
            "SecondaryIdentification": 'US-103913366'
          }
        }
      ],
      "FundingAccounts": [
        {
          "AccountId": Data.Account[AccountSubType = 'CurrentAccount'].AccountId,
          "AccountType": "Personal",
          "AccountSubType": "CurrentAccount",
          "Account": {
            "SchemeName": "AXXD.AccountNumber",
            "Identification": Data.Account[AccountSubType = 'CurrentAccount'].Account.Identification,
            "SecondaryIdentification": Data.Account[AccountSubType = 'CurrentAccount'].Account.SecondaryIdentification
          }
        }
      ]
    }
  }
}`;

export const editPayeeRequest = `{
  "Data": {
    "Payee": {
      "PayeeId": payeeId,
      "FullName": fullName,
      "Nickname": nickName,
      "Phone": phone,
      "Addresses": [
        {
          "StreetName": street,
          "BuildingNumber": "",
          "PostCode": postCode,
          "TownName": city,
          "CountrySubDivision": state,
          "Country": ""
        }
      ],
      "PayeeAccounts": [
        {
          "AccountId": "",
          "AccountType": type = 'Individual' ? 'Personal': 'Business',
          "AccountSubType": "CurrentAccount",
          "Account": {
            "SchemeName": "AXXD.AccountNumber",
            "Identification": accountNumber,
            "SecondaryIdentification": 'US-103913366'
          }
        }
      ]
    }
  }
}`;

export const createPaymentReq = `{
    "Data": {
      "Initiation": {
        "RequestedExecutionDateTime": executionDate,
        "RecurringPaymentInformation": {
          "Frequency": frequency,
          "FirstPaymentDateTime": recurringPaymentDate
        },
        "InstructedAmount": {
            "Amount": amount,
            "Currency": currency
        },
        "CreditorAccount": {
            "SchemeName": "AXXD.PayeeId",
            "Identification": payeeId
        },
        "SupplementaryData": {
            "CheckMemo": checkMemo ? checkMemo : '',
            "PaymentNote": notes ? notes : ''
        }
    }
  }
}`;

export const editPaymentReq = `
{
  "Data": {
    "Initiation": {
      "RequestedExecutionDateTime": executionDate,
        "InstructedAmount": {
          "Amount": amount,
          "Currency": currency
        }
    }
  }
}`;
