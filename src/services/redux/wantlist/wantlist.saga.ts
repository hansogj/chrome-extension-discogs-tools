import '@hansogj/array.utils';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { Collection, WantList } from '../../../domain';
import * as api from '../../api';
import * as collectionService from '../../collection.service';
import { getText } from '../../texts';
import * as wantListService from '../../wantlist.service';
import { sagas as appSagas } from '../app';
import { getAllFoldersReleasesResource } from '../selectors/combined.selectors';
import { selectors as userSelectors, UserActions, UserActionTypes } from '../user';
import { WantListActions } from './types';
import * as wantListActions from './wantlist.actions';

function* syncWantList() {
  const resource: string = yield select(userSelectors.getWantListResource);
  const userId: number = yield select(userSelectors.getUserId);
  yield call(api.syncWantList, userId, resource);
  yield appSagas.notify(getText('settings.resync.explained'));
  yield call(wantlistIsSyncing);
}

function* syncCollection() {
  const resource: string = yield select(getAllFoldersReleasesResource);
  const userId: number = yield select(userSelectors.getUserId);
  yield call(api.syncCollection, userId, resource);
  yield appSagas.notify(getText('settings.collection.sync.explained'));
  yield call(wantlistIsSyncing);
}

function* wantlistIsSyncing(): any {
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

function* onUserSuccess({ user }: UserActionTypes) {
  if (user?.isDone() && user?.get().isOk()) {
    yield all([getWantList(), getCollection()]);
  }
}

function* getWantList() {
  //const userId: number = yield call(appSagas.getUserId);
  const userId: number = yield select(userSelectors.getUserId);
  let result: WantList.Item[] = yield call(wantListService.get, userId);

  if (result.length > 0) {
    yield put(wantListActions.getWantListSuccess(result));
  }
}

function* getCollection() {
  //const userId: number = yield call(appSagas.getUserId);
  const userId: number = yield select(userSelectors.getUserId);
  let result: Collection.Item[] = yield call(collectionService.get, userId);
  if (result.length > 0) {
    yield put(wantListActions.getCollectionSuccess(result));
  }
}

function* WantListSaga() {
  yield all([
    takeLatest(UserActions.GET_USER, onUserSuccess),

    takeLatest(WantListActions.syncWantList, syncWantList),
    takeLatest(WantListActions.syncCollection, syncCollection),
  ]);
}

export default WantListSaga;
