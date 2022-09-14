import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { DEFAULT_HIGHLIGHTED_LABELS } from '../../../constants';
import { PageResourceIds } from '../../releasePage.service';
import { AppState, ERROR, MustHaveArtistReleases, MustHaveReleaseItem, View } from '../app';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';
import { hasArtistReleases, hasReleasePageItem } from './discogs.selectors';

export const getAppState = (state: Partial<RootState>): AppState => selectFromRoot(state, 'App')!;

export const getUser = createSelector(getAppState, ({ user }) => user);

export const getUserId = createSelector(getUser, (user) =>
  maybe(user).mapTo('id').valueOr(undefined),
);

export const getNotification = createSelector(getAppState, (appState: AppState) =>
  maybe(appState).mapTo('notification').valueOr(undefined),
);

export const getError = createSelector(getAppState, (appState: AppState) =>
  maybe(appState).mapTo('error').valueOr(undefined),
);

export const isLoading = createSelector(getAppState, ({ isLoading }) => isLoading);

export const notAuthenticated = createSelector(
  getAppState,
  ({ error }) => error === ERROR.NOT_AUTHENTICATED,
);

export const getActiveView = createSelector(
  getAppState,
  hasReleasePageItem,
  hasArtistReleases,
  (appState, hasPageRelease, hasPageArtistRelease): View =>
    maybe(appState)
      .mapTo('view')
      .map((it) =>
        (MustHaveReleaseItem.includes(it!) && !hasPageRelease) ||
        (MustHaveArtistReleases.includes(it!) && !hasPageArtistRelease)
          ? 'Want List'
          : it,
      )
      .valueOr('Settings') as View,
);

export const getHighlightedLabels = createSelector(getAppState, ({ highlightedLabels }) =>
  maybe(highlightedLabels).valueOr(DEFAULT_HIGHLIGHTED_LABELS),
);
export const getWindowLocation = createSelector(getAppState, (state) =>
  maybe(state).mapTo('windowUrl').valueOr(undefined),
);

const matchers = {
  releases: /\/release\//,
  masters: /\/master\//,
  artists: /\/artist\//,
};
export const getWindowUrlMatch = createSelector(getWindowLocation, (url) =>
  maybe(url)
    .mapTo('pathname')
    .map((pathname) =>
      Object.entries(matchers).reduce(
        (cur, [field, reg]: [string, RegExp]) => ({
          ...cur,
          [field]: maybe(pathname.split(reg))
            .map((it) => it.pop())
            .nothingIf((it) => it === undefined)
            .map((it) => `${it}`.split('-').shift())
            .map((it) => parseInt(it!, 10))
            .nothingIf(isNaN)
            .valueOr(undefined),
        }),

        {} as PageResourceIds,
      ),
    )
    .valueOr({} as PageResourceIds),
);

export const getPathToWindowResource = createSelector(
  getWindowUrlMatch,
  (match: PageResourceIds): string =>
    maybe(match)
      .map(Object.entries)
      .map((it) => it.filter(([_, v]) => Boolean(v)))
      .map((parts) => parts.flatMap((part) => part.join('/')))
      .map((it) => it.shift())
      .valueOr('') as string,
);
