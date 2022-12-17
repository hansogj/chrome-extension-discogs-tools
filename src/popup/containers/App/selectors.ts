import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';

import { getView, getWindowUrlMatch } from '../../../services/redux/app/selectors';
import { View } from '../../../services/redux/app/types';
import { empty } from '../../../services/utils/json.utils';
import { SwitchedView } from './types';

const getViewFromUrlMatch = (urlMatch: ReturnType<typeof getWindowUrlMatch>) =>
  maybe(urlMatch)
    .nothingIf(() => empty(urlMatch))
    .map(({ artists }) => (Boolean(artists) ? 'Artist' : 'Item'))
    .valueOr(undefined);

export const getActiveView = createSelector(
  getView,
  getWindowUrlMatch,
  (optionalView, optionalUrlMatch): View =>
    maybe(optionalView)
      .map((it: View) =>
        ['Settings', 'Want List'].includes(it) ? it : getViewFromUrlMatch(optionalUrlMatch),
      )
      .valueOr('Settings') as View,
);

export const getAvailableViews = createSelector(
  getWindowUrlMatch,
  getActiveView,
  (urlMatch, activeView) =>
    maybe(urlMatch)
      .nothingIf(empty)
      .map((it) =>
        ([getViewFromUrlMatch(it), 'Want List', 'Settings'] as View[])
          .filter(Boolean)
          .map((view: View) => ({ view, isActive: view === activeView } as SwitchedView)),
      )
      .valueOr(undefined),
);
