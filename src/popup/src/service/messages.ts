import { Action } from '../constants';
export const sendChromeMessage = ({ action }: Action, options?: Object) => {
  if (chrome && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs: any[]) =>
      tabs
        .first()
        .forEach((activeTab) =>
          chrome.tabs.sendMessage(activeTab.id, { action, options })
        )
    );
  } else {
    console.log('%c sending message', 'background: #222; color: #88000');
    console.dir({ action, options });
  }
};
