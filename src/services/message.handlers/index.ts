import { ActionTypes as Action } from '../redux';
import { MessageActionMatcher } from './MessageActionMatcher';
import { MessageResolver } from './types';

export * from './types';

export const messageHandlerFactory =
  (messageResolver: MessageResolver, serviceName: string) =>
  (
    action: Action,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void,
  ) => {
    messageResolver(new MessageActionMatcher(action, serviceName))
      .then(sendResponse)
      .catch((error) => sendResponse({ error }));
    return true; // nb, do not remove
  };
