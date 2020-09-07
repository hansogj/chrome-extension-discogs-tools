import { ActionType } from '../constants'
import { colors } from '../Components/styled'

export const sendChromeMessage = (action: ActionType, options?: Object) => {
    if (chrome && chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query(
            { currentWindow: true, active: true },
            (tabs: any[]) =>
                tabs.first().forEach((activeTab) =>
                    chrome.tabs.sendMessage(activeTab.id, {
                        action,
                        options,
                    })
                )
        )
    } else {
        console.log(
            '%c sending message',
            `background: ${colors.dark}; color: ${colors.dread} `
        )
        console.dir({ action, options })
    }
}
