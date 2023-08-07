import '@hansogj/array.utils';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { Collection, WantList } from '../../../domain';
import * as api from '../../api';
import * as collectionService from '../../collection.service';
import { getText } from '../../texts';
import * as wantListService from '../../wantlist.service';
import { sagas as appSagas } from '../app';
import { asyncMaybeOk } from '../domain/async.utils';
import * as combinedSelectors from '../selectors/combined.selectors';
import { UserActionTypes, UserActions, selectors as userSelectors } from '../user';
import * as inventoryActions from './inventory.actions';
import { InventoryActions, SyncStatus } from './types';

export function* syncWantList() {
  const resource: string = yield select(userSelectors.getWantListResource);
  const userId: number = yield select(userSelectors.getUserId);
  yield call(api.syncWantList, userId, resource);
  yield call(inventoryIsSyncing);
  yield appSagas.notify(getText('settings.resync.explained'));
}

export function* syncCollection() {
  const resource: string = yield select(combinedSelectors.getAllFoldersReleasesResource);
  const userId: number = yield select(userSelectors.getUserId);
  yield call(api.syncCollection, userId, resource);
  yield call(inventoryIsSyncing);
  yield appSagas.notify(getText('settings.collection.sync.explained'));
}

export function* inventoryIsSyncing(): any {
  const syncStatus: SyncStatus = yield call(api.getSyncStatus);

  yield put(inventoryActions.setSyncStatus({ syncStatus }));
  if (syncStatus.wantList.isLoading() || syncStatus.collection.isLoading()) {
    yield delay(2000);
    yield call(inventoryIsSyncing);
  } else {
    yield call(getWantList);
    yield call(getCollection);
  }
}

export function* getWantList() {
  const userId: number = yield select(userSelectors.getUserId);
  let wantList: WantList.Item[] = yield call(wantListService.get, userId);

  if (wantList.length > 0) {
    yield put(inventoryActions.getWantListSuccess({ wantList }));
  }
}

export function* getCollection() {
  const userId: number = yield select(userSelectors.getUserId);
  let collection: Collection.Item[] = yield call(collectionService.get, userId);
  if (collection.length > 0) {
    yield put(inventoryActions.getCollectionSuccess({ collection }));
  }
}

export function* onUserSuccess({ user }: UserActionTypes) {
  yield asyncMaybeOk(user!)
    .map(() => all([getWantList(), getCollection()]))
    .valueOr(undefined);
}

export function* InventorySaga() {
  yield all([
    takeLatest(UserActions.GET_USER, onUserSuccess),
    takeLatest(InventoryActions.SYNC_WANTLIST, syncWantList),
    takeLatest(InventoryActions.SYNC_COLLECTION, syncCollection),
  ]);
}

export default InventorySaga;
