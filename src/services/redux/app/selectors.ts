import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { DEFAULT_HIGHLIGHTED_LABELS } from '../../../constants';
import { User } from '../../../domain';
import { AppState, ERROR } from '../app';
import { getLoadedResult } from '../domain';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';

export const getAppState = (state: Partial<RootState>): AppState => selectFromRoot(state, 'App')!;

export const fromApp = <Key extends keyof AppState>(prop: Key) =>
  createSelector(getAppState, (appState) => maybe(appState).mapTo(prop).valueOr(undefined));

export const getUser = fromApp('user');
export const getNotification = fromApp('notification');
export const getError = fromApp('error');
export const isLoading = fromApp('isLoading');
export const getView = fromApp('view');

export const getUserLoaded = createSelector(getUser, (user) =>
  maybe(user).map(getLoadedResult).valueOr(undefined),
);

export const fromUser = <Key extends keyof User>(prop: Key) =>
  createSelector(getUserLoaded, (user) =>
    maybe(user as User)
      .mapTo(prop)
      .valueOr(undefined),
  );

export const getUserId = fromUser('id');

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
