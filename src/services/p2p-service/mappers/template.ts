import { ContactType } from '../../models/p2p-service/contacts';

export const iPayContactsMapperTemplate = `[Data.P2PPayees.{
  "customerId": $string(Payee.PayeeId),
  "email": Payee.EmailAddress,
  "name": Payee.FullName,
  "sharedSecret": Payee.SharedSecret,
  "phone": Payee.PhoneNumber,
  "contactType": "${ContactType.IPAY}"
}]`;

export const iPayContactResponseTemplate = `{
  "customerId": $string(Data.Payee.PayeeId),
  "email": Data.Payee.EmailAddress,
  "name": Data.Payee.FullName,
  "sharedSecret": Data.Payee.SharedSecret,
  "phone": Data.Payee.PhoneNumber
}`;

export const addIPayContactTemplate = `{
  "Data": {
    "Payee": {
      "FullName": name,
      "Nickname": nickName,
      "EmailAddress": email,
      "PhoneNumber": phone,
      "SharedSecret": sharedSecret
    }
  }
}`;

export const p2pPushMessageRequestTemplate = `{
  "device_types": ["ios", "android"],
  "audience": {
    "named_user": customerId
  },
  "merge_data": {
    "template_id": templateId,
    "substitutions": {
      "Name": email,
      "Amount": amount
    }
  }
}`;

//#region fund transfer p2p
// transfer request
export const fundTransferRequestTemplate = `{
  "Data": {
    "SenderP2P": {
      "EndToEndIdentification": transferData.trackingId,
      "InstructionIdentification": transferData.trackingId,
      "LocalInstrument": "P2P",
      "InstructedAmount": {
        "Amount": transferData.amount,
        "Currency": sender.bank.currency
      },
      "DebtorParty": {
        "PartyID": sender.customerId
      },
      "CreditorParty": {
        "SchemeName": "MEED.OWN.BANK",
        "EmailAddress": receiver.email,
        "FullName": receiver.nickname,
        "PartyID": receiver.customerId
      },
      "SupplementaryData": {
        "Notes": [
          {
            "Type": "",
            "Text": transferData.message
          }
        ],
        "SharedSecret": undefined
      }
    }
  }
}`;

// transfer response
export const fundTransferResponseTemplate = `{
  "fundTransferConfirmation": Data.Administrative.ProcessId
}`;

// submit request
export const creditReceiverRequest = `{
  "Data": {
    "RecipientP2P": {
      "EndToEndIdentification": transferData.trackingId,
      "InstructionIdentification": transferData.trackingId,
      "LocalInstrument": "P2P",
      "InstructedAmount": {
        "Amount": transferData.amount,
        "Currency": receiver.bank.currency
      },
      "CreditorParty": {
        "SchemeName": "MEED.OWN.BANK",
        "PartyID": receiver.customerId,
        "EmailAddress": receiver.email,
        "FullName": receiver.nickname
      },
      "SupplementaryData": {
        "Notes": [
          {
            "Type": "",
            "Text": transferData.message
          }
        ]
      }
    }
  }
}`;

// submit response
export const creditReceiverResponse = `{
  "transactionId": Data.RecipientP2P.Transaction.TransactionID,
  "receiverP2PConfirmationCode": Data.Administrative.ProcessId
}`;

// submit external debit
export const debitSenderExternalRequest = `{
  "Data": {
    "SenderP2P": {
      "SupplementaryData": {
        "Notes": [
          {
            "Type": "External transfer",
            "Text": message
          }
        ],
        "SharedSecret": sharedSecret
      }
    }
  }
}`;

//#endregion fund transfer p2p

export const p2pExternalTransferRequestTemplate = `{
  "Data": {
    "SenderP2P": {
      "EndToEndIdentification": trackingId,
      "InstructionIdentification": trackingId,
      "LocalInstrument": "P2P external",
      "InstructedAmount": {
        "Amount": amount,
        "Currency": receiverCurrency ? receiverCurrency : ""
      },
      "DebtorParty": {
        "PartyID": senderCustomerId
      },
      "CreditorParty": {
        "SchemeName": "MEED.OTHER.BANK",
        "EmailAddress": receiverEmail ? receiverEmail : "",
        "FullName": receiverName ? receiverName : "",
        "PartyID": receiverCustomerId ? receiverCustomerId : ""
      },
      "SupplementaryData": {
        "SharedSecret": sharedSecret
      }
    }
  }
}`;

export const p2pExternalTransferResponseTemplate = `{
  "confirmationCode": Data.Administrative.ProcessId,
  "errorCode": Data.Error[0].ErrorCode
}`;
