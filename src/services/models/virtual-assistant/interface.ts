export enum Businessarea {
  English = 'Root.English.Customer',
  Spanish = 'Root.Spanish.Customer'
}

export interface IVAAutoSuggestion {
  AnswerLinkId: string;
  RecognitionId: string;
  QuestionText: string;
}

export interface IVASession {
  ident: string;
  userlogid: string;
  channel: string;
  business_area: string;
  section?: string;
  transaction_count?: number;
}

export interface IVARelatedResult {
  recognition_id?: string;
  question_text?: string;
  generator?: string;
  answer_id?: string;
  faq?: number;
}

export interface IVADialogueConnector {
  click_text: string;
  connector_id: string;
}

export interface IVADialogue {
  dtree_node_id: string;
  back_text: string;
  dtree_id: string;
  back_navigation: boolean;
  connectors: IVADialogueConnector[];
}

export interface IVAChatResponse {
  text: string;
  part_type: string;
}

export interface IVAInterface {
  autocomplete: boolean;
  auto_submit_delay: number;
  display_entry: boolean;
  ics_given: boolean;
  terminate_session: boolean;
  freetext: boolean;
  live_chat_queue: string;
  auto_submit: boolean;
  suggested_entries: string[];
  livechat_requested: boolean;
}

export interface IVAResult {
  recognition_id: string;
  dialogue: IVADialogue;
  related_results_prompt: string;
  disambiguation_items: any[];
  related_results: IVARelatedResult[];
  chat_input: string;
  chat_response: IVAChatResponse[];
  user_intent: string;
  answer_id: string;
}

export interface IVirtualAssistant {
  session: IVASession;
  result: IVAResult;
  inteface: IVAInterface;
}

export interface IVAData extends IVASession, IVARelatedResult {
  entry?: string;
}

export interface IVADTree extends IVAData {
  DTreeRequestType: string;
  Connector_ID: string;
  DTREE_OBJECT_ID: string;
  DTREE_NODE_ID: string;
  ICS_SOURCE_ANSWER_ID: string;
}

export interface IChatHistory {
  ANI: string;
  CustomerID: string;
  ReferenceID: string;
  Email: string;
  FirstName: string;
  LastName: string;
  messages: string;
}

export interface IChatSession {
  ident: string;
  language: string;
  email: string;
  firstName: string;
  lastName: string;
  timeZone: string;
  userLocalTime: string;
}
