import { Collection, WantList } from '../../../domain';
import { WantListActions, WantListActionTypes } from './types';

export const getWantList = (): WantListActionTypes => ({
  type: WantListActions.getWantList,
});

export const syncWantList = (): WantListActionTypes => ({
  type: WantListActions.syncWantList,
});

export const syncCollection = (): WantListActionTypes => ({
  type: WantListActions.syncCollection,
});

export const syncWantListEnded = (): WantListActionTypes => ({
  type: WantListActions.syncWantlistEnded,
});

export const getWantListSuccess = (wantList: WantList.Item[]): WantListActionTypes => ({
  type: WantListActions.getWantListSuccess,
  wantList,
});

export const getCollectionSuccess = (collection: Collection.Item[]): WantListActionTypes => ({
  type: WantListActions.getCollectionSuccess,
  collection,
});
