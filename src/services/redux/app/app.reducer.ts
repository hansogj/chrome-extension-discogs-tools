import { reducerForProducers, writeToDraft } from '../utils';
import { AppActions, AppActionTypes, AppState } from './types';

export const initialState: AppState = {
  user: undefined,
  notification: undefined,
  error: undefined,
  isLoading: false,
  view: undefined,
  highlightedLabels: undefined,
  windowUrl: undefined,
};

const discogsReducer = reducerForProducers<AppState, AppActionTypes, AppActions>(initialState, {
  [AppActions.setUserToken]: (draft, action) => {
    draft.isLoading = true;
  },
  [AppActions.getUser]: (draft, action) => {
    draft.isLoading = true;
  },
  [AppActions.getUserFailed]: (draft, action) => {
    draft.isLoading = false;
  },

  [AppActions.getUserSuccess]: (draft, action) => {
    draft.isLoading = false;
    draft.user = action.user;
    draft.error = undefined;
  },
  [AppActions.error]: (draft, action) => {
    draft.isLoading = false;
    draft.error = action.error;
  },
  [AppActions.notify]: writeToDraft('notification'),
  [AppActions.notifyReset]: writeToDraft('notification'),
  [AppActions.setViewSuccess]: writeToDraft('view'),
  [AppActions.setHighlightedLabelsSuccess]: writeToDraft('highlightedLabels'),
  [AppActions.getHighlightedLabelsSuccess]: writeToDraft('highlightedLabels'),
  [AppActions.logOutSuccess]: writeToDraft('user'),
  [AppActions.windowUrlRetrieved]: writeToDraft('windowUrl'),
  [AppActions.clearStorage]: (draft) => {
    draft.view = undefined;
    draft.highlightedLabels = undefined;
  },
});

export default discogsReducer;
