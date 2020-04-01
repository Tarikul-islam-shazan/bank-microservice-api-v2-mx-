export const immediateTransferTemplate = `{
  "Data": {
    "Initiation": {
      "InstructionIdentification": "ACME413",
      "EndToEndIdentification": "",
      "InstructedAmount": {
        "Amount": amount,
        "Currency": currency
      },
      "DebtorAccount": {
        "SchemeName": "AXXD.INTERNAL_ID",
        "Identification": debtorAccount
      },
      "CreditorAccount": {
        "SchemeName": "AXXD.INTERNAL_ID",
        "Identification": creditorAccount
      },
      "RemittanceInformation": {
        "Unstructured": notes
      }
    }
  }
}`;

export const scheduleTransferTemplate = `{
  "Data": {
    "ConsentId": null,
    "Initiation": {
      "InstructionIdentification": null,
      "EndToEndIdentification": null,
      "LocalInstrument": null,
      "RequestedExecutionDateTime": transferDate,
      "InstructedAmount": {
        "Amount": amount,
        "Currency": currency
      },
      "DebtorAccount": {
        "SchemeName": "AXXD.INTERNAL_ID",
        "Identification": debtorAccount
      },
      "CreditorAccount": {
        "SchemeName": "AXXD.INTERNAL_ID",
        "Identification": creditorAccount
      },
      "CreditorPostalAddress": {},
      "RemittanceInformation": {
        "Reference": null,
        "Unstructured": null
      },
      "SupplementaryData": {
        "Notes": [
          {
            "Type": null,
            "Text": notes
          }
        ]
      }
    }
  }
}`;

export const recurringScheduleTransferTemplate = `{
  "Data": {
    "ConsentId": null,
    "Initiation": {
      "NumberOfPayments": "100",
      "Frequency": frequency,
      "Reference": null,
      "FirstPaymentDateTime": transferDate,
      "RecurringPaymentDateTime": null,
      "FirstPaymentAmount": null,
      "RecurringPaymentAmount": {
        "Amount": amount,
        "Currency": currency
      },
      "FinalPaymentDateTime": null,
      "FinalPaymentAmount": null,
      "DebtorAccount": {
        "SchemeName": "AXXD.INTERNAL_ID",
        "Identification": debtorAccount
      },
      "CreditorAccount": {
        "SchemeName": "AXXD.INTERNAL_ID",
        "Identification": creditorAccount
      },
      "SupplementaryData": {
        "Notes": [
          {
            "Type": null,
            "Text": notes
          }
        ]
      }
    }
  }
}`;
