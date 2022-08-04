import { ActionTypes as Action } from '../redux'

import { Services, MessageResover } from './types'
export * from './types'

export const messageHandlerFactory =
  (messageResolver: MessageResover, services?: Services) =>
  (
    action: Action,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: unknown) => void,
  ) => {
    const resolver = (prom: Promise<unknown>) =>
      prom.then(sendResponse).catch((error) => sendResponse({ error }))
    messageResolver(action, resolver, services)
    return true
  }
