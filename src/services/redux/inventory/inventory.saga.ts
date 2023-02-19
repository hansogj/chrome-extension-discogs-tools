import '@hansogj/array.utils';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { Collection, WantList } from '../../../domain';
import * as api from '../../api';
import * as collectionService from '../../collection.service';
import { getText } from '../../texts';
import * as wantListService from '../../wantlist.service';
import { sagas as appSagas } from '../app';
import * as combinedSelectors from '../selectors/combined.selectors';
import { selectors as userSelectors, UserActions, UserActionTypes } from '../user';
import { InventoryActions } from './types';
import * as wantListActions from './inventory.actions';

export function* syncWantList() {
  const resource: string = yield select(userSelectors.getWantListResource);
  const userId: number = yield select(userSelectors.getUserId);
  yield call(api.syncWantList, userId, resource);
  yield appSagas.notify(getText('settings.resync.explained'));
  yield call(wantlistIsSyncing);
}

export function* syncCollection() {
  const resource: string = yield select(combinedSelectors.getAllFoldersReleasesResource);
  const userId: number = yield select(userSelectors.getUserId);
  yield call(api.syncCollection, userId, resource);
  yield appSagas.notify(getText('settings.collection.sync.explained'));
  yield call(wantlistIsSyncing);
}

export function* wantlistIsSyncing(): any {
  const stillSyncing: boolean = yield call(api.hasOngoingSync);
  if (stillSyncing) {
    yield delay(2000);
    yield call(wantlistIsSyncing);
  } else {
    yield put(wantListActions.syncWantListEnded());
    yield call(getWantList);
    yield call(getCollection);
  }
}

export function* onUserSuccess({ user }: UserActionTypes) {
  if (user?.isDone() && user?.get().isOk()) {
    yield all([getWantList(), getCollection()]);
  }
}

export function* getWantList() {
  const userId: number = yield select(userSelectors.getUserId);
  let result: WantList.Item[] = yield call(wantListService.get, userId);

  if (result.length > 0) {
    yield put(wantListActions.getWantListSuccess(result));
  }
}

export function* getCollection() {
  const userId: number = yield select(userSelectors.getUserId);
  let result: Collection.Item[] = yield call(collectionService.get, userId);
  if (result.length > 0) {
    yield put(wantListActions.getCollectionSuccess(result));
  }
}

export function* InventorySaga() {
  yield all([
    takeLatest(UserActions.GET_USER, onUserSuccess),
    takeLatest(InventoryActions.WANTLIST_SYNC, syncWantList),
    takeLatest(InventoryActions.COLLECTION_SYNC, syncCollection),
  ]);
}

export default InventorySaga;
