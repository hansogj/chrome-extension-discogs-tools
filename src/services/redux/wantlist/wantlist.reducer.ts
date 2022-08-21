import { reducerForProducers } from '../utils';
import { WantListActions, WantListActionTypes, WantListState } from './types';

export const initialState: WantListState = {
  wantList: [],
  isSyncing: false,
  addingToWantList: false,
};

const wantListReducer = reducerForProducers<WantListState, WantListActionTypes, WantListActions>(
  initialState,
  {
    SYNC_WANT_LIST: (draft) => {
      draft.isSyncing = true;
    },
    SYNC_WANT_LIST_ENDED: (draft) => {
      draft.isSyncing = false;
    },
    GET_WANT_LIST_SUCCESS: (draft, action) => {
      draft.wantList = action.wantList!;
    },
  },
);

export default wantListReducer;
