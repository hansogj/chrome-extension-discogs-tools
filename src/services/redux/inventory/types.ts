import { Versions, WantList, Collection } from '../../../domain';
import { ActionDataTypes } from '../types';

export interface InventoryState {
  readonly wantList: WantList.Item[];
  readonly collection: Collection.Item[];
  readonly isSyncing: boolean;
  readonly addingToWantList: boolean;
}

export type InventoryActionData = Mutable<InventoryState> & {
  //collection: Optional<Collection.Item[]>;
  // wantList: Optional<WantList.Item[]>;
  page: number;
  format: Versions.DTO['format'];
};

export enum InventoryActions {
  WANTLIST_SYNC = 'INVENTORY_WANTLIST_SYNC',
  WANTLIST_SYNC_ENDED = 'INVENTORY_WANTLIST_SYNC_ENDED',
  WANTLIST_GET = 'INVENTORY_WANTLIST_GET',
  WANTLIST_GET_SUCCESS = 'INVENTORY_WANTLIST_GET_SUCCESS',
  WANTLIST_GET_FAILED = 'INVENTORY_WANTLIST_GET_FAILED',
  COLLECTION_SYNC = 'INVENTORY_COLLECTION_SYNC',
  COLLECTION_SYNC_ENDED = 'INVENTORY_COLLECTION_SYNC_ENDED',
  COLLECTION_GET = 'INVENTORY_COLLECTION_GET',
  COLLECTION_GET_SUCCESS = 'INVENTORY_COLLECTION_GET_SUCCESS',
  COLLECTION_GET_FAILED = 'INVENTORY_COLLECTION_GET_FAILED',
}

export type InventoryActionTypes = ActionDataTypes<InventoryActions, InventoryActionData>;
