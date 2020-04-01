export const MockForgotUsername = {
  email: 'meed.dummy@yopmail.com'
};

export const MockUsername = 'meed.dummy';

export const mockAccessTokenResponse = {
  data: {
    access_token: 'Return when getaccessToken() called'
  }
};

export const MockChallengeQuestion = {
  key: 'b3db673f-5da6-42bf-9ad6-4da501275537',
  questions: [
    {
      question: 'Favorite food?',
      id: 'http://wso2.org/claims/challengeQuestion3'
    }
  ]
};

export const MockChallengeQTemplate = {
  data: {
    Key: 'b3db673f-5da6-42bf-9ad6-4da501275537',
    ChallengeQuestions: [
      {
        Question: 'Favorite food?',
        Id: 'http://wso2.org/claims/challengeQuestion3'
      }
    ]
  }
};

export const MockValidateData = {
  username: MockUsername,
  key: MockChallengeQuestion.key,
  answers: [
    {
      answer: 'Pizza',
      id: MockChallengeQuestion.questions[0].id
    }
  ]
};

export const MockResetPass = {
  username: MockUsername,
  key: MockChallengeQuestion.key,
  password: 'ebf7718e7517e6a4fa2aee9ef05421a4c0b18a62b3ba6c98a82e179309907b43'
};
