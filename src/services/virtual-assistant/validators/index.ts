import Joi from '@hapi/joi';

export const InitVirtualAssistant = Joi.object({
  language: Joi.string().required()
});

export const LiveChatSession = Joi.object({
  ident: Joi.string().required(),
  language: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  timeZone: Joi.string().required(),
  userLocalTime: Joi.string().required()
});

export const SaveChat = Joi.object({
  ANI: Joi.string().required(),
  CustomerID: Joi.string().required(),
  ReferenceID: Joi.string().required(),
  Email: Joi.string().required(),
  FirstName: Joi.string().required(),
  LastName: Joi.string().required(),
  messages: Joi.string().required()
});

export const GeneralChat = Joi.object({
  ident: Joi.string().required(),
  userlogid: Joi.string().required(),
  entry: Joi.string().required(),
  channel: Joi.string().required(),
  business_area: Joi.string().required()
});

export const FaqChat = GeneralChat.append({
  recognition_id: Joi.string().required(),
  answer_id: Joi.string().required(),
  faq: Joi.number().required()
});

export const DialogueTree = GeneralChat.append({
  DTreeRequestType: Joi.string().required(),
  Connector_ID: Joi.string().required(),
  DTREE_OBJECT_ID: Joi.string().required(),
  DTREE_NODE_ID: Joi.string().required(),
  ICS_SOURCE_ANSWER_ID: Joi.string().required()
});

export const Chat = Joi.alternatives().try(GeneralChat, FaqChat);
