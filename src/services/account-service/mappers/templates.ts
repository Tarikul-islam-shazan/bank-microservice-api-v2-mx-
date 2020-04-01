import { AccountStatus, AccountLock, SweepState } from '../../models/account-service/interface';

//creditLimitExceeded work if any(daily,weekly or monthly) limit exceeded
export const accountSummary = `[Data.Account[Status!="Terminated"].{
  'accountId': AccountId,
  'accountNumber': Account.Identification,
  'accountType': AccountSubType = 'SAV' ? 'SSA' : AccountSubType,
  'balanceOwed': $number(Balance[Type = 'balanceOwed'].Amount.Amount),
  'currentBalance': $number(Balance[Type = 'currentBalance'].Amount.Amount),
  'holdBalance': 0,
  'availableBalance': $number(Balance[Type = 'availableBalance'].Amount.Amount),
  'minimumDue': Balance[Type = 'MinimumExpected'].Amount.Amount ? $number(Balance[Type = 'MinimumExpected'].Amount.Amount) : 0,
  'interestEarned': AccountSubType = 'SAV' ? Balance[Type = 'interestYTD'].Amount.Amount ? $number(Balance[Type = 'interestYTD'].Amount.Amount) : 0 ,
  'creditLimitExceeded': AccessLimit[0].LimitExceeded = "true" or AccessLimit[1].LimitExceeded = "true" or  AccessLimit[2].LimitExceeded = "true" ? true : false,
  'status': (
  	$lockStatus := function($status, $lockStatus){
    	$status = ${AccountStatus.Active} and $lockStatus = ${AccountLock.Frozen} ? ${AccountLock.Frozen} :
        $status = ${AccountStatus.Active} and $lockStatus = ${AccountLock.CreditsOnly} ? ${AccountLock.CreditsOnly} :
        $status = ${AccountStatus.Inactive} ? ${AccountStatus.Inactive} :
        $status = ${AccountStatus.Dormant} ? ${AccountStatus.Dormant} :
        $status = ${AccountStatus.ChargeOff} ? ${AccountStatus.ChargeOff}
    };
    $lockStatus(Status, AccountLocks.code);
  ),
  'routingNumber': $substring(Account.SecondaryIdentification, 3)
}]`;

export const transactions = `{
  "postedTransactions": [Data.Transaction[Status="Booked"].{
    "transactionType": $trim(TransactionInformation),
    "amount": CreditDebitIndicator = 'Debit' ? -1 * $number(Amount.Amount) : $number(Amount.Amount),
    "notes": $trim(TransactionInformation),
    "dateTime": ValueDateTime,
    "referenceNumber": TransactionId,
    "fromAccount": DebtorAccount.Identification,
    "toAccount": CreditorAccount.Identification,
    "status": Status,
    "city": SupplementaryData.Notes[Type='TerminalCity'].Text ? SupplementaryData.Notes[Type='TerminalCity'].Text : '',
    "state": SupplementaryData.Notes[Type='TerminalState'].Text ? SupplementaryData.Notes[Type='TerminalState'].Text : '',
    "country": SupplementaryData.Notes[Type='TerminalCountry'].Text ? SupplementaryData.Notes[Type='TerminalCountry'].Text : ''
  }],
  "pendingTransactions": [Data.Transaction[Status="Pending"].{
    "transactionType": $trim(TransactionInformation),
    "amount": CreditDebitIndicator = 'Debit' ? -1 * $number(Amount.Amount) : $number(Amount.Amount),
    "notes": $trim(TransactionInformation),
    "dateTime": ValueDateTime,
    "referenceNumber": TransactionId,
    "fromAccount": DebtorAccount.Identification,
    "toAccount": CreditorAccount.Identification,
    "status": Status,
    "city": SupplementaryData.Notes[Type='TerminalCity'].Text ? SupplementaryData.Notes[Type='TerminalCity'].Text : '',
    "state": SupplementaryData.Notes[Type='TerminalState'].Text ? SupplementaryData.Notes[Type='TerminalState'].Text : '',
    "country": SupplementaryData.Notes[Type='TerminalCountry'].Text ? SupplementaryData.Notes[Type='TerminalCountry'].Text : ''
  }]
}`;

export const statements = `
			[Data.Statements.{
				"statementId": Id,
				"accountId": AccountId,
				"statementDate": CreationDateTime
			}]`;

export const monthlyStatements = `{
			"documents": Data.Statement.Content,
			"type": Data.Statement.Type
		}`;

export const transactionSearchQueries = `
		{
			"amountFrom": amountFrom ? amountFrom : undefined,
			"amountTo":  amountTo ? amountTo : undefined,
			"withPendingTransactions":  true,
			"keywords": keywords = "" ? undefined : keywords,
			"includeCredits": includeCredits,
			"includeDebits": includeDebits
		}`;

export const getSweepStateResponse = `{
	"state": Sweeping.Status = 'Activated' ? '${SweepState.Activate}' : '${SweepState.Deactivate}'
}`;
