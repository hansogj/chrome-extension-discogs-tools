import { ActionTypes } from '../redux';
import { ERROR } from '../redux/app';

type Rejection = { error: unknown };
let queryOptions = { active: true, currentWindow: true };

const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  chrome && chrome.tabs && chrome.tabs.query
    ? chrome.tabs.query(queryOptions).then(([tab]) => tab)
    : Promise.reject(ERROR.NO_TAB_TO_CAPTURE);

const asPromised = (
  cb: (resolver: (response: Response | Rejection) => void) => void,
): Promise<Response> =>
  new Promise((resolve, reject) => {
    try {
      cb((response: Response | Rejection) =>
        response && (response as Rejection).error
          ? reject(response as Rejection)
          : resolve(response as any),
      );
    } catch (error) {
      console.error('failing in sending message', error);
      reject(error);
    }
  });

const sendMessage = (id = 0, body: ActionTypes) =>
  Promise.race([
    asPromised((resolver) => chrome.tabs.sendMessage(id, body, resolver)),
    asPromised((resolver) => chrome.runtime.sendMessage(body, resolver)),
  ]);

const messageHandler = <T>(action: ActionTypes, override: Partial<ActionTypes> = {}) =>
  getCurrentTab()
    .then(({ id }) => sendMessage(id, action))
    .catch((e) => {
      if (e === ERROR.NO_TAB_TO_CAPTURE && window.location.href.includes('localhost')) {
        return require('./__mock__/popup.message.handler').messageHandlerFallback(action, override);
      }
      throw e;
    }) as Promise<T>;

export default messageHandler;
