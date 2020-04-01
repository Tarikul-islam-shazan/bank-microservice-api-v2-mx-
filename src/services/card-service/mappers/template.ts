export const cardDetailsTemplate = `[Cards[Status.Text !='Cancelled'].$.[{
  "cardId": CardId,
  "cardNumber": CardNumber,
  "isCardActive": Status.Text = 'Active' ? true: false
}]]`;
