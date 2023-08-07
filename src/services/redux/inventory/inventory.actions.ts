import { toAction } from '../utils';
import { InventoryActionData, InventoryActions } from './types';

// prettier-ignore
const { SYNC_STATUS,  WANTLIST_GET, WANTLIST_GET_SUCCESS, SYNC_COLLECTION, SYNC_WANTLIST,   COLLECTION_GET, COLLECTION_GET_SUCCESS, COLLECTION_GET_FAILED, } = InventoryActions;

const toInventoryAction =
  (type: InventoryActions) =>
  (data: Partial<InventoryActionData> = {}) =>
    toAction<InventoryActions, Partial<InventoryActionData>>(type, data);

export const getWantList = toInventoryAction(WANTLIST_GET);
export const getWantListSuccess = toInventoryAction(WANTLIST_GET_SUCCESS);
export const getCollectionSuccess = toInventoryAction(COLLECTION_GET_SUCCESS);
export const setSyncStatus = toInventoryAction(SYNC_STATUS);

export const syncCollection = toInventoryAction(SYNC_COLLECTION);
export const syncWantList = toInventoryAction(SYNC_WANTLIST);
