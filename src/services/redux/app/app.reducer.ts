import { reducerForProducers, writeToDraft } from '../utils';
import { AppActions, AppActionTypes, AppState } from './types';

export const initialState: AppState = {
  user: undefined,
  notification: undefined,
  error: undefined,
  isLoading: true,
  view: undefined,
  highlightedLabels: undefined,
  windowUrl: undefined,
};

const discogsReducer = reducerForProducers<AppState, AppActionTypes, AppActions>(initialState, {
  SET_USER_TOKEN: (draft, action) => {
    draft.isLoading = true;
  },

  GET_USER_SUCCESS: (draft, action) => {
    draft.isLoading = false;
    draft.user = action.user;
    draft.error = undefined;
  },
  APP_ERROR: (draft, action) => {
    draft.isLoading = false;
    draft.error = action.error;
  },
  APP_NOTIFY: writeToDraft('notification'),
  APP_NOTIFY_RESET: writeToDraft('notification'),
  APP_SET_VIEW_SUCCESS: writeToDraft('view'),
  APP_SET_HIGHLIGHTED_LABELS_SUCCESS: writeToDraft('highlightedLabels'),
  APP_GET_HIGHLIGHTED_LABELS_SUCCESS: writeToDraft('highlightedLabels'),
  APP_LOG_OUT_SUCCESS: writeToDraft('user'),
  WINDOW_URL_RETRIEVED: writeToDraft('windowUrl'),
});

export default discogsReducer;
