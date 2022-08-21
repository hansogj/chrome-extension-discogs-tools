import { Version, WantList } from '../../../domain';
import { ActionTypes } from '../types';

export interface WantListState {
  readonly wantList: WantList;
  readonly isSyncing: boolean;
  readonly addingToWantList: boolean;
}

export interface WantListActionData {
  wantList: Optional<WantList>;
  page: Optional<number>;
  format: Optional<Version['format']>;
}

export enum WantListActions {
  getWantList = 'GET_WANT_LIST',
  syncWantList = 'SYNC_WANT_LIST',
  syncWantlistEnded = 'SYNC_WANT_LIST_ENDED',
  getWantListSuccess = 'GET_WANT_LIST_SUCCESS',
  getWantListFailed = 'GET_WANT_LIST_FAILED',
}

export type WantListActionTypes = ActionTypes<WantListActions, WantListActionData>;
