import { ActionTypes } from "../../redux";
import { ERROR } from "../../redux/app";
import { messageResolver } from "../chrome/message.handler";

type Rejection = { error: unknown };
let queryOptions = { active: true, currentWindow: true };

/* const addListener = (myTabId?: number) =>
  chrome.runtime.onMessage.addListener(dispatcher);
  const dispatcher = () => import("../../redux").then(({ action }) => action);
 */
const getCurrentTab = (): Promise<chrome.tabs.Tab> =>
  chrome && chrome.tabs && chrome.tabs.query
    ? chrome.tabs.query(queryOptions).then(([tab]) => tab)
    : Promise.reject(ERROR.NO_TAB_TO_CAPTURE);

const sendMessage = (id = 0, body: ActionTypes): Promise<Response> =>
  new Promise((resolve, reject) => {
    try {
      return chrome.tabs.sendMessage(
        id,
        body,
        (response: Response | Rejection) => {
          response && (response as Rejection).error
            ? reject(response as Rejection)
            : resolve(response as Response);
        }
      );
    } catch (error) {
      console.error("failing in sending message", error);
      reject(error);
    }
  });

const resolver = (prom: Promise<unknown>) =>
  prom
    .then((e) => Promise.resolve(e))
    .catch((error) => Promise.reject({ error }));

const messageHandler = <T>(
  action: ActionTypes,
  override: Partial<ActionTypes> = {}
) =>
  getCurrentTab()
    .then(({ id }) => sendMessage(id, action))
    .catch((e) => {
      if (
        ERROR.NO_TAB_TO_CAPTURE &&
        window.location.href.includes("localhost")
      ) {
        return messageResolver(
          { ...action, ...override } as ActionTypes,
          resolver
        );
      }
      throw e;
    }) as Promise<T>;

export default messageHandler;
