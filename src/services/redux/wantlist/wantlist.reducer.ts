import { reducerForProducers, writeToDraft } from '../utils';
import { WantListActions, WantListActionTypes, WantListState } from './types';

export const initialState: WantListState = {
  wantList: [],
  collection: [],
  isSyncing: false,
  addingToWantList: false,
};

const wantListReducer = reducerForProducers<WantListState, WantListActionTypes, WantListActions>(
  initialState,
  {
    [WantListActions.syncWantList]: (draft) => {
      draft.isSyncing = true;
    },
    [WantListActions.syncWantlistEnded]: (draft) => {
      draft.isSyncing = false;
    },
    [WantListActions.getWantListSuccess]: writeToDraft('wantList'),

    [WantListActions.syncCollection]: (draft) => {
      draft.isSyncing = true;
    },
    [WantListActions.syncCollectionEnded]: (draft) => {
      draft.isSyncing = false;
    },
    [WantListActions.getCollectionSuccess]: writeToDraft('collection'),
  },
);

export default wantListReducer;
