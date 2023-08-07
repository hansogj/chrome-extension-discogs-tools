import { Versions, WantList, Collection } from '../../../domain';
import { Async } from '../domain';
import { ActionDataTypes } from '../types';

export type SyncStatus = { wantList: Async.Type<string>; collection: Async.Type<string> };

export interface InventoryState {
  readonly wantList: WantList.Item[];
  readonly collection: Collection.Item[];
  readonly syncStatus: SyncStatus;
  readonly addingToWantList: boolean;
}

export type InventoryActionData = Mutable<InventoryState> & {
  page: number;
  format: Versions.DTO['format'];
};

export enum InventoryActions {
  SYNC_STATUS = 'INVENTORY_SYNC_STATUS',
  SYNC_WANTLIST = 'INVENTORY_SYNC_WANTLIST',
  SYNC_COLLECTION = 'INVENTORY_SYNC_COLLECTION',
  WANTLIST_GET = 'INVENTORY_WANTLIST_GET',
  WANTLIST_GET_SUCCESS = 'INVENTORY_WANTLIST_GET_SUCCESS',
  WANTLIST_GET_FAILED = 'INVENTORY_WANTLIST_GET_FAILED',
  COLLECTION_GET = 'INVENTORY_COLLECTION_GET',
  COLLECTION_GET_SUCCESS = 'INVENTORY_COLLECTION_GET_SUCCESS',
  COLLECTION_GET_FAILED = 'INVENTORY_COLLECTION_GET_FAILED',
}

export type InventoryActionTypes = ActionDataTypes<InventoryActions, InventoryActionData>;
