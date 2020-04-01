export const getScheduledTransfersTemplate = `
  [Data.DomesticScheduledPayments.{
    "amount": Initiation.InstructedAmount.Amount,
    "transferDate": Initiation.RequestedExecutionDateTime,
    "debtorAccount": Initiation.DebtorAccount.Identification,
    "creditorAccount": Initiation.CreditorAccount.Identification,
    "notes": Initiation.SupplementaryData.Notes[0].Text,
    "frequency": "Once",
    "transferId": DomesticScheduledPaymentId,
    "currency": Initiation.InstructedAmount.Currency,
    "transferType":"Scheduled"
  }]
`;

export const getRecurringScheduledTransfersTemplate = `
  [Data.DomesticStandingOrders.{
    "amount": Initiation.RecurringPaymentAmount.Amount,
    "transferDate": Initiation.FirstPaymentDateTime,
    "debtorAccount": Initiation.DebtorAccount.Identification,
    "creditorAccount": Initiation.CreditorAccount.Identification,
    "notes": Initiation.SupplementaryData.Notes[0].Text,
    "frequency": Initiation.Frequency,
    "transferId": DomesticStandingOrderId,
    "currency": Initiation.RecurringPaymentAmount.Currency,
    "transferType":"Recurring"
  }]
`;
