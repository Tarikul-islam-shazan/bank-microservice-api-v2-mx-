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
  "metodoNombre": "MTD128",
  "metodopEntrada": [
    { "llave": "string", "valor": customerId },
    { "llave": "string", "valor": addressType },
    { "llave": "string", "valor": propertyType },
    { "llave": "string", "valor": postCode },
    { "llave": "string", "valor": state },
    { "llave": "string", "valor": municipality },
    { "llave": "string", "valor": city },
    { "llave": "string", "valor": suburb },
    { "llave": "string", "valor": street },
    { "llave": "string", "valor": outdoorNumber },
    { "llave": "string", "valor": interiorNumber },
    { "llave": "string", "valor": dateOfResidence }
  ]
}`;

export const generalInfoTemplate = `{
  "metodoNombre": "MTD126",
  "metodopEntrada": [
    { "llave": "string", "valor": "A" },
    { "llave": "string", "valor": customerId },
    { "llave": "string", "valor": "01" },
    { "llave": "string", "valor": paternalLastName },
    { "llave": "string", "valor": maternalLastName },
    { "llave": "string", "valor": firstName },
    { "llave": "string", "valor": secondName },
    { "llave": "string", "valor": dateOfBirth },
    { "llave": "string", "valor": curp },
    { "llave": "string", "valor": mobileNumber },
    { "llave": "string", "valor": email }
  ]
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

export const beneficiaryInfoTempl = `{
  "metodoNombre": "MTD130",
  "metodopEntrada": [
    { "llave": "string", "valor": customerId },
    { "llave": "string", "valor": paternalLastName },
    { "llave": "string", "valor": maternalLastName },
    { "llave": "string", "valor": firstName },
    { "llave": "string", "valor": secondName },
    { "llave": "string", "valor": dateOfBirth },
    { "llave": "string", "valor": relationship }
  ]
}`;

export const fundProviderRequestTemplate = `{
  "metodoNombre": "MTD140",
  "metodopEntrada": [
    { "llave": "string", "valor": customerId },
    { "llave": "string", "valor": paternalLastName },
    { "llave": "string", "valor": maternalLastName },
    { "llave": "string", "valor": firstName },
    { "llave": "string", "valor": secondName },
    { "llave": "string", "valor": dateOfBirth },
    { "llave": "string", "valor": "01" },
    { "llave": "string", "valor": "A" }
  ]
}`;

export const personalInfoTemplate = `{
  "metodoNombre": "MTD127",
  "metodopEntrada": [
    { "llave": "string", "valor": customerId },
    { "llave": "string", "valor": sex },
    { "llave": "string", "valor": countryOfBirth },
    { "llave": "string", "valor": nationality },
    { "llave": "string", "valor": placeOfBirth },
    { "llave": "string", "valor": maritalStatus },
    { "llave": "string", "valor": profession },
    { "llave": "string", "valor": occupation },
    { "llave": "string", "valor": economicActivity },
    { "llave": "string", "valor": hightLevelOfEducation },
    { "llave": "string", "valor": banxicoActivity }
  ]
}`;
