const constants = {
  'meed/signup/member/email': {
    location: 'meed-controller',
    action: 'signup-email'
  },
  'meed/signup/member/nickname': {
    location: 'meed-controller',
    action: 'add-nickname'
  },
  'meed/signup/countries': {
    location: 'meed-controller',
    action: 'get-countries'
  },
  'meed/onboarding/countries/:countryId/states': {
    location: 'meed-controller',
    action: 'get-states'
  },
  'bank/onboarding/security-questions': {
    location: 'onboarding-controller',
    action: 'security-question'
  },
  'bank/onboarding/create-login': {
    location: 'onboarding-controller',
    action: 'create-login'
  },
  'bank/onboarding/terms-and-conditions': {
    location: 'onboarding-controller',
    action: 'terms-and-condition'
  },
  'bank/onboarding/identity-questions': {
    location: 'onboarding-controller',
    action: 'identity-question'
  },
  'bank/onboarding/apply': {
    location: 'onboarding-controller',
    action: 'apply-for-account'
  },
  'bank/onboarding/registration-fee': {
    location: 'onboarding-controller',
    action: 'fund-account'
  },
  'bank/accounts': {
    location: 'account-controller',
    action: 'account-summary'
  },
  'bank/accounts/:accountId/transactions': {
    location: 'account-controller',
    action: 'get-transactions'
  },
  login: {
    location: 'bank-login-service-controller',
    action: 'login'
  },
  'uas/register-email-address': {
    location: 'urbanairship-controller',
    action: 'register-email-address'
  },
  'uas/update-email-channel': {
    location: 'urbanairship-controller',
    action: 'update-email-channel'
  },
  'uas/associate-email-to-named-user-id': {
    location: 'urbanairship-controller',
    action: 'associate-email-to-named-user-id'
  },
  'uas/add-initial-tags': {
    location: 'urbanairship-controller',
    action: 'add-initial-tags'
  },
  'uas/named-user-lookup': {
    location: 'urbanairship-controller',
    action: 'named-user-lookup'
  },
  'uas/add-tag': {
    location: 'urbanairship-controller',
    action: 'add-tag'
  },
  'uas/remove-tag': {
    location: 'urbanairship-controller',
    action: 'remove-tag'
  },
  'cards/:customerId': {
    location: 'card-service-controller',
    action: 'card-details'
  },
  'cards/:cardId/:state': {
    location: 'card-service-controller',
    action: 'update-card-state'
  },
  'savings-goals': {
    location: 'savings-goals-controller',
    action: 'savings-goals'
  },
  'savings-goals/:id': {
    location: 'savings-goals-controller',
    action: 'savings-goals'
  },
  'jumio-verification/:identifier': {
    location: 'jumio-service-controller',
    action: 'verification'
  },
  'jumio-web-initiate': {
    location: 'jumio-service-controller',
    action: 'web-initiate'
  },
  'logger/ui': {
    location: 'mobile-bff',
    action: 'UILogger'
  },
  'p2p/ipay-contacts': {
    location: 'p2p-service-controller',
    action: 'add-ipay-contact'
  },
  'p2p/ipay-contacts/:id': {
    location: 'p2p-service-controller',
    action: 'update-ipay-contact'
  },
  'p2p/transfers/requests/create': {
    location: 'p2p-service-controller',
    action: 'create-fund-request'
  },
  'p2p/transfers/requests/incoming': {
    location: 'p2p-service-controller',
    action: 'incoming-fund-requests'
  },
  'p2p/transfers/requests/outgoing': {
    location: 'p2p-service-controller',
    action: 'outgoing-fund-requests'
  },
  'p2p/transfers/requests/cancel': {
    location: 'p2p-service-controller',
    action: 'cancel-fund-request'
  },
  'p2p/transfers/requests/decline': {
    location: 'p2p-service-controller',
    action: 'decline-fund-request'
  },
  'p2p/transfers/send': {
    location: 'p2p-service-controller',
    action: 'send-fund'
  },
  'p2p/transfers/submit': {
    location: 'p2p-service-controller',
    action: 'submit-transfer'
  },
  'p2p/transfers/external': {
    location: 'p2p-service-controller',
    action: 'external-transfer'
  }
};

export default constants;
