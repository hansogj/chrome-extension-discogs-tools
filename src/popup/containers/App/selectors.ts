import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';

import { selectors as appSelectors, ResourceMatcher } from '../../../services/redux/app';
import { View } from '../../../services/redux/app/types';
import { empty } from '../../../services/utils/json.utils';
import { SwitchedView } from './types';

const alwaysAvailable: View[] = ['Settings', 'Want List'];

const getViewFromUrlMatch = (urlMatch: ResourceMatcher) =>
  maybe(urlMatch)
    .nothingIf(() => empty(urlMatch))
    .map(({ artists }) => (Boolean(artists) ? 'Artist' : 'Item'))
    .valueOr(undefined);

const viewIsAlwaysOkOrFallbackToViewFromUrl = (it: View, optionalUrlMatch: ResourceMatcher) =>
  alwaysAvailable.includes(it) ? it : getViewFromUrlMatch(optionalUrlMatch);

export const getActiveView = createSelector(
  appSelectors.getView,
  appSelectors.getWindowUrlMatch,
  (optionalView, optionalUrlMatch): View =>
    maybe(optionalView)
      .map((view) => viewIsAlwaysOkOrFallbackToViewFromUrl(view, optionalUrlMatch))
      .valueOr('Settings') as View,
);

export const getAvailableViews = createSelector(
  appSelectors.getWindowUrlMatch,
  getActiveView,
  (urlMatch, activeView) =>
    maybe(urlMatch)
      .nothingIf(empty)
      .map((it) =>
        ([getViewFromUrlMatch(it), 'Want List', 'Settings'] as View[])
          .filter(Boolean)
          .map((view: View) => ({ view, isActive: view === activeView } as SwitchedView)),
      )
      .valueOr([]),
);
