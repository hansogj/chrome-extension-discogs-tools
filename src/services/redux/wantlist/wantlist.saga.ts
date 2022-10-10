import '@hansogj/array.utils';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { Collection, WantList } from '../../../domain';
import * as api from '../../api';
import { getText } from '../../texts';
import * as wantListService from '../../wantlist.service';
import * as collectionService from '../../collection.service';
import { AppActions, sagas as appSagas } from '../app';
import {
  getAllFoldersReleasesResource,
  getWantListResource,
} from '../selectors/resource.selectors';
import { WantListActions } from './types';
import * as wantListActions from './wantlist.actions';

function* syncWantList() {
  const resource: string = yield select(getWantListResource);
  const userId: number = yield call(appSagas.getUserId);
  yield call(api.syncWantList, userId, resource);
  yield appSagas.notify(getText('settings.resync.explained'));
  yield call(wantlistIsSyncing);
}

function* syncCollection() {
  const resource: string = yield select(getAllFoldersReleasesResource);
  const userId: number = yield call(appSagas.getUserId);
  yield call(api.syncCollection, userId, resource);
  yield appSagas.notify(getText('settings.collection.sync.explained'));
  yield call(wantlistIsSyncing);
}

function* wantlistIsSyncing(): any {
  const stillSyncing: boolean = yield call(api.wantlistIsSyncing);
  if (stillSyncing) {
    yield delay(2000);
    yield call(wantlistIsSyncing);
  } else {
    yield put(wantListActions.syncWantListEnded());
    yield call(getWantList);
    yield call(getCollection);
  }
}

function* getWantList() {
  const userId: number = yield call(appSagas.getUserId);
  let result: WantList.Item[] = yield call(wantListService.get, userId);

  if (result.length > 0) {
    yield put(wantListActions.getWantListSuccess(result));
  }
}

function* getCollection() {
  const userId: number = yield call(appSagas.getUserId);
  let result: Collection.Item[] = yield call(collectionService.get, userId);
  if (result.length > 0) {
    yield put(wantListActions.getCollectionSuccess(result));
  }
}

function* DiscogsSaga() {
  yield all([
    takeLatest(AppActions.getUserSuccess, getWantList),
    takeLatest(AppActions.getUserSuccess, getCollection),

    takeLatest(WantListActions.syncWantList, syncWantList),
    takeLatest(WantListActions.syncCollection, syncCollection),
  ]);
}

export default DiscogsSaga;
