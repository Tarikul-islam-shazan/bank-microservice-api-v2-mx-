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

export const JumioWebHookRequestTemplate = `
{
  "Data": {
    "JumioResponse": {
      "callBackType": "NETVERIFYID",
      "callbackDate": "2019-08-26T04:45:41.448Z",
      "clientIp": "198.51.100.42",
      "customerId": username,
      "firstAttemptDate": "2019-08-26T04:44:28.275Z",
      "optionalData1": "string",
      "optionalData2": "string",
      "dni": "string",
      "gender": "M",
      "presetCountry": "string",
      "presetIdType": "DRIVING_LICENSE",
      "originDob": "string",
      "idAddress": {
        "city": "CALABASAS",
        "country": "USA",
        "stateCode": "US-CA",
        "streetName": "GRANADA",
        "streetNumber": "12345",
        "unitDesignator": "string",
        "unitNumber": "string",
        "streetSuffix": "PARK",
        "streetDirection": "string",
        "zip": "91302",
        "zipExtension": "string"
      },
      "merchantIdScanReference": "string",
      "merchantReportingCriteria": "string",
      "idCheckDataPositions": "OK",
      "idCheckDocumentValidation": "OK",
      "idCheckHologram": "OK",
      "idCheckMRZcode": "N/A",
      "idCheckMicroprint": "OK",
      "idCheckSecurityFeatures": "OK",
      "idCheckSignature": "OK",
      "idCountry": "USA",
      "idDob": "1993-06-24",
      "idExpiry": "2021-06-24",
      "idFirstName": "JOHN",
      "idLastName": "DOE",
      "idNumber": "A1234567",
      "idScanImage": "https://netverify.com/recognition/v1/idscan/d6624eb6-b865-4a61-9793-0ec0d63cb17d/front",
      "idScanImageBackside": "https://netverify.com/recognition/v1/idscan/d6624eb6-b865-4a61-9793-0ec0d63cb17d/back",
      "idScanImageFace": "https://netverify.com/recognition/v1/idscan/d6624eb6-b865-4a61-9793-0ec0d63cb17d/face",
      "idScanSource": "SDK",
      "idScanStatus": "SUCCESS",
      "idType": "DRIVING_LICENSE",
      "idSubtype": "NATIONAL_ID",
      "idUsState": "CA",
      "personalNumber": "string",
      "identityVerification": {
        "similarity": "MATCH",
        "validity": true,
        "reason": "SELFIE_CROPPED_FROM_ID",
        "handwrittenNoteMatches": true
      },
      "jumioIdScanReference": "d6624eb6-b865-4a61-9793-0ec0d63cb17d",
      "livenessImages": [
        "https://netverify.com/api/netverify/v2/scans/d6624eb6-b865-4a61-9793-0ec0d63cb17d/images/liveness/1","https://netverify.com/api/netverify/v2/scans/d6624eb6-b865-4a61-9793-0ec0d63cb17d/images/liveness/2","https://netverify.com/api/netverify/v2/scans/d6624eb6-b865-4a61-9793-0ec0d63cb17d/images/liveness/3","https://netverify.com/api/netverify/v2/scans/d6624eb6-b865-4a61-9793-0ec0d63cb17d/images/liveness/4","https://netverify.com/api/netverify/v2/scans/d6624eb6-b865-4a61-9793-0ec0d63cb17d/images/liveness/5"
      ],
      "placeOfBirth": "string",
      "transactionDate": "2019-08-26T04:43:45.180Z",
      "verificationStatus": "APPROVED_VERIFIED"
    }
  }
}`;
