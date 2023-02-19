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
// prettier-ignore
const { APP_ERROR, APP_NOTIFY, APP_NOTIFY_RESET, APP_SET_VIEW_SUCCESS, APP_SET_HIGHLIGHTED_LABELS_SUCCESS, APP_GET_HIGHLIGHTED_LABELS_SUCCESS, APP_WINDOW_URL_RETRIEVED, APP_CLEAR_STORAGE, } = AppActions;

const discogsReducer = reducerForProducers<AppState, AppActionTypes, AppActions>(initialState, {
  [APP_ERROR]: (draft, action) => {
    draft.isLoading = false;
    draft.error = action.error;
  },
  [APP_NOTIFY]: writeToDraft('notification'),
  [APP_NOTIFY_RESET]: writeToDraft('notification'),
  [APP_SET_VIEW_SUCCESS]: writeToDraft('view'),
  [APP_SET_HIGHLIGHTED_LABELS_SUCCESS]: writeToDraft('highlightedLabels'),
  [APP_GET_HIGHLIGHTED_LABELS_SUCCESS]: writeToDraft('highlightedLabels'),
  [APP_WINDOW_URL_RETRIEVED]: writeToDraft('windowUrl'),
  [APP_CLEAR_STORAGE as any]: writeValuesToDraft({
    view: undefined,
    highlightedLabels: undefined,
  }),
});

export default discogsReducer;
