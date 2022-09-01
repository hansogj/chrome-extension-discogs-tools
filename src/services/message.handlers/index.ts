import { ActionTypes as Action } from '../redux';
import { MessageResolver } from './types';

export * from './types';

export const messageHandlerFactory =
  (messageResolver: MessageResolver) =>
  (
    action: Action,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void,
  ) => {
    messageResolver(action)
      .then(sendResponse)
      .catch((error) => sendResponse({ error }));
    return true; // nb, do not remove
  };
