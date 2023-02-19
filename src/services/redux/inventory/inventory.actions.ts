import { Collection, WantList } from '../../../domain';
import { InventoryActions, InventoryActionTypes } from './types';

export const getWantList = (): InventoryActionTypes => ({
  type: InventoryActions.WANTLIST_GET,
});

export const syncWantList = (): InventoryActionTypes => ({
  type: InventoryActions.WANTLIST_SYNC,
});

export const syncCollection = (): InventoryActionTypes => ({
  type: InventoryActions.COLLECTION_SYNC,
});

export const syncWantListEnded = (): InventoryActionTypes => ({
  type: InventoryActions.WANTLIST_SYNC_ENDED,
});

export const getWantListSuccess = (wantList: WantList.Item[]): InventoryActionTypes => ({
  type: InventoryActions.WANTLIST_GET_SUCCESS,
  wantList,
});

export const getCollectionSuccess = (collection: Collection.Item[]): InventoryActionTypes => ({
  type: InventoryActions.COLLECTION_GET_SUCCESS,
  collection,
});
