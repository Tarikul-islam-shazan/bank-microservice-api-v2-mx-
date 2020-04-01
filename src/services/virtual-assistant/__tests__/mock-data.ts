export const mockLanguage = 'en_US';

export const mockInitRaw = {
  data: {
    info: {
      status: 'success',
      message: '',
      code: '200',
      validresponse: 'CVUSAVA Status: Ok',
      reconnected: false
    },
    session: {
      ident: '3875536514318302678457',
      userlogid: '3808174669',
      channel: 'Root.App',
      business_area: 'Root.English.Customer',
      section: 'Root.English',
      transaction_count: 1
    },
    result: {
      content: {
        recognition_id: '3',
        dialogue: {
          dtree_node_id: '',
          back_text: '',
          connectors: [],
          dtree_id: '',
          back_navigation: false
        },
        related_results_prompt: '',
        disambiguation_items: [],
        related_results: [],
        chat_input: '',
        chat_response: [
          {
            text: '<p>Welcome to Meed’s Virtual Assistant, how can we help you?</p>',
            part_type: 'normal'
          }
        ],
        user_intent: '',
        answer_id: '3'
      },
      interface: {
        autocomplete: true,
        auto_submit_delay: 40,
        display_entry: true,
        ics_given: false,
        terminate_session: false,
        freetext: true,
        live_chat_queue: '',
        auto_submit: false,
        suggested_entries: [
          'Where do I find the bank routing number?',
          'How do I activate my card?',
          'What is my account number?'
        ],
        livechat_requested: false
      }
    }
  }
};

export const mockInit = {
  info: {
    status: 'success',
    message: '',
    code: '200',
    validresponse: 'CVUSAVA Status: Ok',
    reconnected: false
  },
  session: {
    ident: '3875536514318302678457',
    userlogid: '3808174669',
    channel: 'Root.App',
    business_area: 'Root.English.Customer',
    section: 'Root.English',
    transaction_count: 1
  },
  result: {
    recognition_id: '3',
    dialogue: {
      dtree_node_id: '',
      back_text: '',
      connectors: [],
      dtree_id: '',
      back_navigation: false
    },
    related_results_prompt: '',
    disambiguation_items: [],
    related_results: [],
    chat_input: '',
    chat_response: [
      {
        text: '<p>Welcome to Meed’s Virtual Assistant, how can we help you?</p>',
        part_type: 'normal'
      }
    ],
    user_intent: '',
    answer_id: '3'
  },
  inteface: {
    autocomplete: true,
    auto_submit_delay: 40,
    display_entry: true,
    ics_given: false,
    terminate_session: false,
    freetext: true,
    live_chat_queue: '',
    auto_submit: false,
    suggested_entries: [
      'Where do I find the bank routing number?',
      'How do I activate my card?',
      'What is my account number?'
    ],
    livechat_requested: false
  }
};

export const chatSessionReq = {
  language: 'en_US',
  email: 'meed.test@yopmail.com',
  firstName: 'John',
  lastName: 'Doe',
  timeZone: 'Asia/Dhaka',
  userLocalTime: '9:33 AM',
  ident: mockInit.session.ident
};

export const getAutoSugParams = {
  ident: '3875536514318302678457',
  userlogid: '3808174669',
  channel: 'Root.App',
  business_area: 'Root.English.Customer',
  entry: 'activation code'
};

export const postAutoSugReq = {
  ...getAutoSugParams,
  recognition_id: '65',
  answer_id: '138',
  faq: 1
};

export const mockAutoSug = [
  {
    AnswerLinkId: '138',
    RecognitionId: '65',
    QuestionText: 'Where can I find my transaction history?'
  }
];

export const saveChatReq = {
  ANI: 'jhsiufaf515fwe1eehfhbbijhebfib',
  CustomerID: '0000006991',
  ReferenceID: 'mockrefer',
  Email: 'meed.test@yopmail.com',
  FirstName: 'meed',
  LastName: 'test',
  messages: 'not a message'
};

export const dlgTreeReq = {
  ...getAutoSugParams,
  DTreeRequestType: 'mock',
  Connector_ID: 'mock',
  DTREE_OBJECT_ID: 'mock',
  DTREE_NODE_ID: 'mock',
  ICS_SOURCE_ANSWER_ID: 'mock'
};

export const chatQueueRaw = {
  data: {
    code: 0,
    message: null,
    customerId: null,
    departmentId: null,
    queueStateVOList: [
      {
        code: 0,
        message: null,
        customerId: null,
        departmentId: null,
        agentCount: null,
        userCount: null,
        waitingUsers: null,
        queueId: 1,
        waitCount: 0,
        estimatedTime: '0',
        activeSessions: 0,
        averageChatDuration: 0,
        queueName: 'Meed Share',
        concurrentAgents: null,
        availableAgents: [],
        queueState: null,
        queueStateId: null,
        queueStateName: null,
        availableAgentsList: null,
        personalWaitCount: 0
      },
      {
        code: 0,
        message: null,
        customerId: null,
        departmentId: null,
        agentCount: null,
        userCount: null,
        waitingUsers: null,
        queueId: 2,
        waitCount: 0,
        estimatedTime: '0',
        activeSessions: 0,
        averageChatDuration: 0,
        queueName: 'Other',
        concurrentAgents: null,
        availableAgents: [],
        queueState: null,
        queueStateId: null,
        queueStateName: null,
        availableAgentsList: null,
        personalWaitCount: 0
      },
      {
        code: 0,
        message: null,
        customerId: null,
        departmentId: null,
        agentCount: null,
        userCount: null,
        waitingUsers: null,
        queueId: 3,
        waitCount: 0,
        estimatedTime: '0',
        activeSessions: 0,
        averageChatDuration: 0,
        queueName: 'Account',
        concurrentAgents: null,
        availableAgents: [],
        queueState: null,
        queueStateId: null,
        queueStateName: null,
        availableAgentsList: null,
        personalWaitCount: 0
      },
      {
        code: 0,
        message: null,
        customerId: null,
        departmentId: null,
        agentCount: null,
        userCount: null,
        waitingUsers: null,
        queueId: 4,
        waitCount: 0,
        estimatedTime: '0',
        activeSessions: 0,
        averageChatDuration: 0,
        queueName: 'Meed Share SP',
        concurrentAgents: null,
        availableAgents: [],
        queueState: null,
        queueStateId: null,
        queueStateName: null,
        availableAgentsList: null,
        personalWaitCount: 0
      }
    ]
  }
};

export const refreshTokenRaw = {
  data: '4a09c69f-b3bc-4ec6-a991-bc4d3bcbc7a2',
  headers: {
    'set-cookie': ['JSESSIONID=A836C50B2784AD1D7429992E679358DD; Path=/livechat; HttpOnly']
  }
};

export const genChatReq = { ...getAutoSugParams };
export const faqChatReq = { ...postAutoSugReq };
