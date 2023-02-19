import {
  passReducer,
  reducerForProducers,
  writeToDraft,
} from '../../../gist/immer-utils/immer.utils';
import { InventoryActions, InventoryActionTypes, InventoryState } from './types';

export const initialState: InventoryState = {
  wantList: [],
  collection: [],
  isSyncing: false,
  addingToWantList: false,
};
// prettier-ignore
const { WANTLIST_SYNC, WANTLIST_SYNC_ENDED, WANTLIST_GET, WANTLIST_GET_SUCCESS, WANTLIST_GET_FAILED, COLLECTION_SYNC, COLLECTION_SYNC_ENDED, COLLECTION_GET, COLLECTION_GET_SUCCESS, COLLECTION_GET_FAILED} = InventoryActions;

const wantListReducer = reducerForProducers<InventoryState, InventoryActionTypes, InventoryActions>(
  initialState,
  {
    [WANTLIST_SYNC]: (draft) => (draft.isSyncing = true),
    [WANTLIST_SYNC_ENDED]: (draft) => (draft.isSyncing = false),
    [WANTLIST_GET_SUCCESS]: writeToDraft('wantList'),
    [COLLECTION_SYNC]: (draft) => (draft.isSyncing = true),
    [COLLECTION_SYNC_ENDED]: (draft) => (draft.isSyncing = false),
    [COLLECTION_GET_SUCCESS]: writeToDraft('collection'),
    [WANTLIST_GET]: passReducer,
    [WANTLIST_GET_FAILED]: passReducer,
    [COLLECTION_GET]: passReducer,
    [COLLECTION_GET_FAILED]: passReducer,
  },
);

export default wantListReducer;
