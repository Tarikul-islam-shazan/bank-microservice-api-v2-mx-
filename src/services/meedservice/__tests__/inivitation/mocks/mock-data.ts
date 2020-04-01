export const mockMember = {
  id: '5da4104f801f2742a236c986',
  applicationStatus: 'application-completed',
  applicationProgress: 'registration-completed',
  accountStatus: 'account-opened',
  email: 'meed.dummy@yopmail.com',
  nickName: 'John Doe',
  bank: '5c17349a8ca47446b6103696',
  country: '5ab159487fabb066abb60025',
  username: 'meed.dummy',
  nickname: 'John Doe',
  customerId: '0000006569',
  language: 'en_US'
};

export const mockP2pMessage = {
  name: 'John',
  message: 'Hi John, you should join the Meed Banking Club!'
};

export const mockSendInvite = {
  message: 'Hi, you should join the Meed Banking Club, I think you’ll like it.',
  language: 'en-us',
  inviteeEmail: 'somenonmembermeed@yopmail.com'
};

export const mockInvitation = {
  id: '5da59a096dd7b23300aeb006',
  status: 'SENT',
  member: mockMember.id,
  inviteeEmail: mockSendInvite.inviteeEmail,
  message: mockSendInvite.message,
  expirationDate: '2019-11-15T10:08:18.219Z',
  createdDate: '2019-10-15T10:08:18.220Z'
};

export const mockSendgridError = {
  response: {
    body: {
      errors: [
        {
          message: 'mock sendgrid error'
        }
      ]
    }
  }
};
