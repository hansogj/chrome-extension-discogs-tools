import '@hansogj/array.utils';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { WantList } from '../../../domain';
import * as api from '../../api';
import * as wantListService from '../../wantlist.service';
import { AppActions, sagas as appSagas } from '../app';
import { getWantListResource } from '../selectors/resource.selectors';
import { WantListActions } from './types';
import * as wantListActions from './wantlist.actions';

function* syncWantList(): Generator<any> {
  const resource = yield select(getWantListResource);
  const userId = yield call(appSagas.getUserId);
  yield call(api.syncWantList, userId as number, resource as string);
  yield appSagas.notify(
    'Synchronizing want list. This may take a while - do not close window while waiting',
  );
  yield call(wantlistIsSyncing);
}

function* wantlistIsSyncing(): Generator<any> {
  const stillSyncing = yield call(api.wantlistIsSyncing) as unknown as boolean;
  if (stillSyncing) {
    yield delay(2000);
    yield call(wantlistIsSyncing);
  } else {
    yield put(wantListActions.syncWantListEnded());
  }
}

function* getWantList(): Generator<any> {
  const userId = yield call(appSagas.getUserId);
  let result = yield call(wantListService.get, userId as number);

  if (Object.keys(result as any).length === 0) {
  } else {
    yield put(wantListActions.getWantListSuccess(result as WantList));
  }
}

function* DiscogsSaga() {
  yield all([
    takeLatest(AppActions.getUserSuccess, getWantList),
    takeLatest(WantListActions.getWantList, getWantList),
    takeLatest(WantListActions.syncWantList, syncWantList),
  ]);
}

export default DiscogsSaga;
