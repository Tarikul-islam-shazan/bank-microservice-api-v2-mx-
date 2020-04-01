import { asyncWrapper } from '../../middleware/asyncWrapper';
import VirtualAssistantController from './controller';
import AuthMiddleware from '../../middleware/authMiddleware';
import handleValidation, { ValidationLevel } from '../../middleware/validator';
import {
  InitVirtualAssistant,
  Chat,
  GeneralChat,
  FaqChat,
  DialogueTree,
  LiveChatSession,
  SaveChat
} from './validators';

export default [
  {
    path: 'v1.0.0/virtual-assistant/initialize',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(InitVirtualAssistant, ValidationLevel.Query),
      asyncWrapper(VirtualAssistantController.initialize)
    ]
  },
  {
    path: 'v1.0.0/virtual-assistant/chat',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(Chat, ValidationLevel.Body),
      asyncWrapper(VirtualAssistantController.chat)
    ]
  },
  {
    path: 'v1.0.0/virtual-assistant/chat/session',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(LiveChatSession, ValidationLevel.Body),
      asyncWrapper(VirtualAssistantController.createLiveChatSession)
    ]
  },
  {
    path: 'v1.0.0/virtual-assistant/chat/save',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(SaveChat, ValidationLevel.Body),
      asyncWrapper(VirtualAssistantController.saveChatHistory)
    ]
  },
  {
    path: 'v1.0.0/virtual-assistant/autosuggest',
    method: 'get',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(GeneralChat, ValidationLevel.Query),
      asyncWrapper(VirtualAssistantController.getAutosuggestion)
    ]
  },
  {
    path: 'v1.0.0/virtual-assistant/autosuggest',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(FaqChat, ValidationLevel.Body),
      asyncWrapper(VirtualAssistantController.submitAutosuggestion)
    ]
  },
  {
    path: 'v1.0.0/virtual-assistant/dialogue-tree',
    method: 'post',
    handler: [
      AuthMiddleware.isBankAuthenticated,
      handleValidation(DialogueTree, ValidationLevel.Body),
      asyncWrapper(VirtualAssistantController.submitDialogueTree)
    ]
  }
];
