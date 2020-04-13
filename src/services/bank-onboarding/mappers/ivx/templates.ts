export const identityAnswer = `{
  "Data": {
    "KYC": {
      "IDA": {
        "Questions": [
          $.identityAnswers.{
            "Id": questionId,
            "Answer": {
              "Id": answerId
            }
          }
        ]
      }
    }
  }
}`;

export const signUpRequestTemplate = `
{
  "Data": {
    "Party": [
      {
        "PartyType": isRelatedToArmedForces = 'member' ? 'Military' : 'Sole',
        "Salutation": prefix,
        "FirstName": firstName,
        "MiddleName": middleName,
        "LastName": lastName,
        "TIN": socialSecurityNo,
        "DateOfBirth": dateOfBirth,
        "EmailAddress": email,
        "Phone": workPhone,
        "Mobile": mobilePhone,
        "Identification": [
          {
            "Type": identityType = 'DrivingLicence' ? 'DriversLicense' : identityType = 'Passport' ? 'Passport' : identityType = 'StateId' ? "StateID" : identityType = 'MilitaryId' ? "MilitaryID",
            "Number": identityNumber,
            "CountrySubdivision": state,
            "Country": country,
            "Issuer": state
          }
        ],
        "Financials": {
          "Occupation": {
            "Industry": occupation,
            "MonthlyNetIncome": {
              "Amount": monthlyIncome ? monthlyIncome : 0,
              "Currency": "USD"
            }
          },
          "DueDiligence": {
            "IncomeSource": sourceOfIncome,
            "MonthlyWithdraw": monthlyWithdrawal ? monthlyWithdrawal : 0,
            "MonthlyDeposit": monthlyDeposit ? monthlyDeposit : 0
          }
        },
        "Address": [
          {
            "AddressType": "Residential",
            "AddressLine": [
              addressLine1,
              addressLine2
            ],
            "StreetName": addressLine1,
            "BuildingNumber": null,
            "PostCode": zipCode,
            "TownName": city,
            "CountrySubdivision": state,
            "Country": country
          }
        ]
      },
      corporateCustomerId ? {
        "PartyType" : "Corporate",
        "PartyId" : corporateCustomerId
      },
      isRelatedToArmedForces = 'dependent' ? {
        "PartyType": "Military",
        "Salutation": "",
        "FirstName": armedForcesMemberFirstName,
        "LastName": armedForcesMemberLastName,
        "TIN": armedForcesSocialSecurityPin,
        "DateOfBirth": armedForcesDob,
        "EmailAddress": null,
        "Phone": null,
        "Mobile": null,
        "Identification": [],
        "Address": []
      }
    ],
    "KYC": {
      "VideoCheck": {
        "Result": 0,
        "Similarity": null,
        "Reason": "",
        "Validity": null,
        "ValidationDate": null
      }
    },
    "Documents": [
      {
        "Type": "PHOTO ID",
        "Document": ""
      }
    ]
  }
}`;

export const ScannedIdDataTemplate = `
{
  "VideoCheck": {
      "Result": 0,
      "Similarity": null,
      "Reason": "",
      "Validity": null,
      "ValidationDate": null,
      "ReferenceId": reference,
      "ExtractionMethod": extractionMethod,
      "Party": {
          "FirstName": firstName,
          "LastName": lastName,
          "DateOfBirth": dateOfBirth,
          "Gender": gender
      },
      "Address": {
          "AddressType": "Business",
          "AddressLine": [
              addressLine
          ],
          "StreetName": null,
          "BuildingNumber": null,
          "PostCode": postCode,
          "TownName": city,
          "CountrySubdivision": subdivision,
          "Country": country
      },
      "Identification": {
          "Type": identificationType,
          "Number": idNumber,
          "CountrySubdivision": subdivision,
          "Country": country,
          "Issuer": issuingCountry,
          "IssuingDate": issuingDate,
          "ExpiryDate": expiryDate
      }
  }
}`;

export const productOnboarding = `{
  "Data": {
    "Product": {
      "ProductId": 'BUNDLE_M',
      "ProductVersion": '1',
      "PromotionId" : promotionCode ? promotionCode : undefined
    },
    "Party": {
      "PartyId": customerId
    }
  }
}`;

export const addressInfoTemplate = `{

}`;

export const stateCityMunicipality = `{
  "metodoNombre": "MTD122",
  "metodopEntrada": [
    {
      "llave" : "string",
      "valor": postCode
    }
  ]
}`;

export const stateCitymunicipalityResponseTemplate = `[$.{
  "stateName": estadonombre,
  "state": cve_entfed,
  "municipalityName": municipionombre,
  "municipality": cve_municipio,
  "cityName": ciudadnombre,
  "city": cve_ciudad,
  "suburbName": nombre,
  "suburb": c_asentamiento
}]`;
