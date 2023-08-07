import { AsyncData } from '@swan-io/boxed';
import {
  passReducer,
  reducerForProducers,
  writeToDraft,
} from '../../../gist/immer-utils/immer.utils';
import { InventoryActions, InventoryActionTypes, InventoryState, SyncStatus } from './types';

export const initialSyncStatus = (): SyncStatus => ({
  collection: AsyncData.NotAsked(),
  wantList: AsyncData.NotAsked(),
});

export const initialState: InventoryState = {
  wantList: [],
  collection: [],
  syncStatus: initialSyncStatus(),
  addingToWantList: false,
};
// prettier-ignore
const {  WANTLIST_GET, SYNC_WANTLIST, SYNC_COLLECTION, WANTLIST_GET_SUCCESS, WANTLIST_GET_FAILED, SYNC_STATUS, COLLECTION_GET, COLLECTION_GET_SUCCESS, COLLECTION_GET_FAILED} = InventoryActions;

const wantListReducer = reducerForProducers<InventoryState, InventoryActionTypes, InventoryActions>(
  initialState,
  {
    [WANTLIST_GET]: passReducer,
    [WANTLIST_GET_SUCCESS]: writeToDraft('wantList'),
    [WANTLIST_GET_FAILED]: passReducer,
    [COLLECTION_GET]: passReducer,
    [COLLECTION_GET_SUCCESS]: writeToDraft('collection'),
    [COLLECTION_GET_FAILED]: passReducer,

    [SYNC_STATUS]: writeToDraft('syncStatus'),
    [SYNC_WANTLIST]: passReducer,
    [SYNC_COLLECTION]: passReducer,
  },
);

export default wantListReducer;
