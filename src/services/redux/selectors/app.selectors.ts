import maybe from 'maybe-for-sure';
import { createSelector } from 'reselect';
import { DEFAULT_HIGHLIGHTED_LABELS } from '../../../constants';
import { AppState, ERROR, MustHaveReleaseItem, View } from '../app';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';
import { getReleasePageItem } from './discogs.selectors';

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
  getReleasePageItem,
  (appState, releasePageItem): View =>
    maybe(appState)
      .mapTo('view')
      .map((it) => (MustHaveReleaseItem.includes(it!) && !releasePageItem ? 'Want List' : it))
      .valueOr('Settings') as View,
);

export const getHighlightedLabels = createSelector(getAppState, ({ highlightedLabels }) =>
  maybe(highlightedLabels).valueOr(DEFAULT_HIGHLIGHTED_LABELS),
);
