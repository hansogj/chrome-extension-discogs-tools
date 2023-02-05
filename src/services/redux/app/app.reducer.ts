import { AsyncData } from '@swan-io/boxed';
import {
  reducerForProducers,
  writeToDraft,
  writeValuesToDraft,
} from '../../../gist/immer-utils/immer.utils';
import { AppActions, AppActionTypes, AppState } from './types';

export const initialState: AppState = {
  notification: undefined,
  error: undefined,
  isLoading: false,
  view: undefined,
  highlightedLabels: undefined,
  windowUrl: undefined,
};

const discogsReducer = reducerForProducers<AppState, AppActionTypes, AppActions>(initialState, {
  [AppActions.error]: (draft, action) => {
    draft.isLoading = false;
    draft.error = action.error;
  },
  [AppActions.notify]: writeToDraft('notification'),
  [AppActions.notifyReset]: writeToDraft('notification'),
  [AppActions.setViewSuccess]: writeToDraft('view'),
  [AppActions.setHighlightedLabelsSuccess]: writeToDraft('highlightedLabels'),
  [AppActions.getHighlightedLabelsSuccess]: writeToDraft('highlightedLabels'),
  [AppActions.windowUrlRetrieved]: writeToDraft('windowUrl'),
  [AppActions.clearStorage as any]: writeValuesToDraft({
    view: undefined,
    highlightedLabels: undefined,
  }),
});

export default discogsReducer;
