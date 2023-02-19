import { Versions, WantList, Collection } from '../../../domain';
import { ActionDataTypes } from '../types';

export interface WantListState {
  readonly wantList: WantList.Item[];
  readonly collection: Collection.Item[];
  readonly isSyncing: boolean;
  readonly addingToWantList: boolean;
}

export interface WantListActionData {
  collection: Optional<Collection.Item[]>;
  wantList: Optional<WantList.Item[]>;
  page: Optional<number>;
  format: Optional<Versions.DTO['format']>;
}

export enum WantListActions {
  getWantList = 'GET_WANT_LIST',
  syncWantList = 'SYNC_WANT_LIST',
  syncWantlistEnded = 'SYNC_WANT_LIST_ENDED',
  getWantListSuccess = 'GET_WANT_LIST_SUCCESS',
  getWantListFailed = 'GET_WANT_LIST_FAILED',
  syncCollection = 'SYNC_COLLECTION',
  syncCollectionEnded = 'SYNC_COLLECTION_ENDED',
  getCollection = 'GET_COLLECTION_',
  getCollectionSuccess = 'GET_COLLECTION_SUCCESSs',
}

export type WantListActionTypes = ActionDataTypes<WantListActions, WantListActionData>;
