import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { DEFAULT_HIGHLIGHTED_LABELS } from '../../../constants';
import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';
import { AppState } from '../app';
import { RootState } from '../root.reducers';
import { ResourceMatcher, resourceMatchers } from './types';

export const getAppState = (state: Partial<RootState>): AppState => selectFromRoot(state, 'App')!;

export const fromApp = <Key extends keyof AppState>(prop: Key) =>
  createSelector(getAppState, (appState) => maybe(appState).mapTo(prop).valueOr(undefined));

export const getNotification = fromApp('notification');
export const getError = fromApp('error');
export const isLoading = fromApp('isLoading');
export const getView = fromApp('view');

export const getHighlightedLabels = createSelector(getAppState, ({ highlightedLabels }) =>
  maybe(highlightedLabels).valueOr(DEFAULT_HIGHLIGHTED_LABELS),
);
export const getWindowLocation = createSelector(getAppState, (state) =>
  maybe(state).mapTo('windowUrl').valueOr(undefined),
);

export const getWindowUrlMatch = createSelector(getWindowLocation, (url) =>
  maybe(url)
    .mapTo('pathname')
    .map((pathname) =>
      Object.entries(resourceMatchers).reduce(
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

        {} as ResourceMatcher,
      ),
    )
    .valueOr({} as ResourceMatcher),
);

export const getPathToWindowResource = createSelector(
  getWindowUrlMatch,
  (match: ResourceMatcher): string =>
    maybe(match)
      .map(Object.entries)
      .map((it) => it.filter(([_, v]) => Boolean(v)))
      .map((parts) => parts.flatMap((part) => part.join('/')))
      .map((it) => it.shift())
      .valueOr('') as string,
);
