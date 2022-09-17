import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { DEFAULT_HIGHLIGHTED_LABELS } from '../../../constants';
import { AppState, ERROR, View, Views } from '../app';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';

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

        {} as Record<keyof typeof matchers, number>,
      ),
    )
    .valueOr({} as Record<keyof typeof matchers, number>),
);

export const getPathToWindowResource = createSelector(
  getWindowUrlMatch,
  (match: Record<keyof typeof matchers, number>): string =>
    maybe(match)
      .map(Object.entries)
      .map((it) => it.filter(([_, v]) => Boolean(v)))
      .map((parts) => parts.flatMap((part) => part.join('/')))
      .map((it) => it.shift())
      .valueOr('') as string,
);

export const getActiveView = createSelector(
  getAppState,
  getWindowUrlMatch,
  (appState, urlMatch): View =>
    maybe(appState)
      .mapTo('view')
      .nothingIf(
        (it) =>
          (it === 'Artist' && !urlMatch.artists) ||
          (it === 'Item' && !urlMatch.masters && !urlMatch.releases),
      )

      .valueOr('Settings') as View,
);

export const getViews = createSelector(getWindowUrlMatch, getActiveView, (urlMatch, activeView) =>
  maybe(urlMatch)
    .nothingIf((it) => JSON.stringify(it) === '{}')
    .map((it) => {
      console.log(activeView);
      return Views.filter((view) => {
        if (view === 'Artist') return Boolean(it.artists);
        if (view === 'Item') return Boolean(it.masters) || Boolean(it.releases);
        return true;
      }).map((view) => ({ view, isActive: view === activeView }));
    })
    .valueOr(undefined),
);
