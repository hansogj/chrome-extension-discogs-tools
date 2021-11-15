import 'array.defined/lib/polyfill'
import 'array.onempty'
import { Action, LoadAction } from '../popup/src/constants'
import { addToCollection } from './addToCollection'
import {
    addToWantlist,
    filterAndAddToWantlist,
    removeFromWantlist,
} from './addToWantlist'
import './contentscript.scss'
import './labelAlert'
import { flyttTil, setOpphav } from './setCustomField'
import { uniqueRelease } from './uniqueRelease'
import { uniqueSeller } from './uniqueSeller'
import find from './util/find'
import { getSearchParams } from './util/searchParams'

find('.activity_menu_total')
    .map((a: HTMLAnchorElement) => parseInt(a.innerText))
    .filter((num) => num > 0)
    .flatMap(() => find('.icon.icon-envelope'))
    .map((elem: HTMLElement) => (elem.style.color = '#fb7a7a'))

export const RequestMapping = {
    uniqueSeller,
    uniqueRelease,
    flyttTil,
    setOpphav,
    filterAndAddToWantlist,
    addToWantlist,
    removeFromWantlist,
    addRelease: addToCollection,
}

chrome.runtime.onMessage.addListener((request: Action, sender, sendResponse) =>
    Object.keys(RequestMapping)
        .filter((action) => action === request.action)
        .map((action) => RequestMapping[action])
        .map((action) => action(request.options))
        .onEmpty(() => {
            console.error('could not find any matching action', request.action)
        })
)
;[LoadAction.AddToWantlist]
    .filter((loadAction) => loadAction === getSearchParams().loadAction)
    .map(addToWantlist)
