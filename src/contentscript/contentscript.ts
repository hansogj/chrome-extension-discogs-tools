import 'array.defined/lib/polyfill';
import 'array.onempty';
import { addToCollection } from './addToCollection';
import { addToWantlist, removeFromWantlist } from './addToWantlist';
import './contentscript.scss';
import './labelAlert';
import { uniqueRelease } from './uniqueRelease';
import { uniqueSeller } from './uniqueSeller';
import find from './util/find';

const isThisContentscript = true;
console.log('isThisContentscript', isThisContentscript);

find('.icon.icon-envelope').forEach(
  (elem: HTMLElement) => (elem.style.color = 'red')
);

const requestMapping = {
  uniqueSeller,
  uniqueRelease,
  addToWantlist,
  removeFromWantlist,
  addRelease: addToCollection,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
  Object.keys(requestMapping)
    .filter((action) => action === request.action)
    .map((action) => requestMapping[action])
    .map((action) => action(request.options))
    .onEmpty(() => {
      console.error('could not find any matching action', request.action);
    })
);
