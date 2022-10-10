import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { MAX_LOGIN_ATTEMPTS } from '../../../constants';
import { HighlightedLabels, OauthIdentity, User } from '../../../domain';
import * as api from '../../api';
import * as labelService from '../../highlighted.labels.service';
import { get, set, uniqueKey, remove } from '../../storage';
import * as userTokenService from '../../userToken.service';
import { empty } from '../../utils/json.utils';
import { DiscogsActions } from '../discogs';
import * as appSelectors from '../selectors/app.selectors';
import { AppActions, AppActionTypes, DISCOGS_BASE_URL, ERROR, View } from './';
import * as actions from './app.actions';
import { ActionButton } from './types';

function* getUser(_: any, count = 0): any {
  try {
    const storedToken: string = yield call(userTokenService.get);
    if (!Boolean(storedToken)) throw new Error(ERROR.NOT_AUTHENTICATED);
    const identity: OauthIdentity = yield call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`);
    if (identity) {
      const user: User = yield call(api.fetch, identity.resource_url);

      yield put(actions.getUserSuccess(user));
      return true;
    } else {
      if (count < MAX_LOGIN_ATTEMPTS) {
        yield getUser(_, count + 1);
      } else throw new Error(ERROR.NOT_AUTHENTICATED);
    }
  } catch (error) {
    console.log('caught authentication error', error);
    yield put(actions.error(ERROR.NOT_AUTHENTICATED));
    if (count < MAX_LOGIN_ATTEMPTS) {
      getUser(_, count + 1);
    } else {
      yield put(actions.getUserFailed());
    }
  }
}

export function* getUserId() {
  const userId: number = yield select(appSelectors.getUserId);
  if (userId) {
    yield userId;
    return userId;
  } else {
    throw new Error('Cannot find any userId ');
  }
}

export function* notify(message: string, actionBtn?: ActionButton, timeout = 5000) {
  yield put(actions.notify({ message, actionBtn }));
  yield delay(timeout);
  yield put(actions.notifyReset());
}

export function* warn(message: string, timeout = 5000) {
  yield put(actions.warn({ message }));
  yield delay(timeout);
  yield put(actions.notifyReset());
}

function* setUserToken({ userToken }: AppActionTypes) {
  if (userToken) {
    yield call(userTokenService.set, userToken!);
    yield call(getUser, 0);
  } else {
    yield call(userTokenService.remove);
    yield put(actions.logOutSuccess());
  }
}

function* setView({ view }: AppActionTypes) {
  yield call(set, 'view', view);
  yield put(actions.setViewSuccess(view!));
}
function* getView() {
  const view: View = yield call(get, 'view', '');
  yield put(actions.setViewSuccess(empty(view) ? undefined : view));
}

function* setHighlightedLabels({ highlightedLabels: labels }: AppActionTypes) {
  try {
    yield call(labelService.set, labels!);
    yield put(actions.setHighlightedLabelsSuccess(labels as HighlightedLabels));
    yield call(api.applyHighlightedLabels);
  } catch (e) {
    debugger;
  }
}

function* clearStorage() {
  const userId: number = yield select(appSelectors.getUserId);
  /*   | 'token'
  | 'want-list'
  | 'user-collection'
  | 'cache'
  | 'selected-fields'
  | 'view'
  | 'highlighted-labels'; */

  yield call(remove, 'view');
  yield call(remove, 'highlighted-labels');
  yield call(remove, uniqueKey('user-collection', userId));
  yield call(remove, uniqueKey('selected-fields', userId));
  yield call(remove, uniqueKey('want-list', userId));
}

function* getHighlightedLabels() {
  try {
    const labels: HighlightedLabels = yield call(labelService.get);
    if (labels) {
      yield put(actions.getHighlightedLabelsSuccess(labels));
      yield call(api.applyHighlightedLabels);
    }
  } catch (e) {
    debugger;
  }
}
function* getWindowUrl() {
  let url: URL = yield call(api.getWindowLocation);
  yield put(actions.windowUrlRetrieved(url as URL));
}

function* onUserSuccess() {
  yield all([getView(), getHighlightedLabels(), getWindowUrl()]);
}

function* goToUrl({ url }: AppActionTypes) {
  yield api.manipulateDom(DiscogsActions.domGoTo, `${url}`);
}

function* AppSaga() {
  try {
    yield all([
      takeLatest(AppActions.getUser, getUser),
      takeLatest(AppActions.logOut, setUserToken),
      takeLatest(AppActions.setUserToken, setUserToken),
      takeLatest(AppActions.setUserTokenSuccess, getUser),
      takeLatest(AppActions.setView, setView),
      takeLatest(AppActions.getUserSuccess, onUserSuccess),
      takeLatest(AppActions.setHighlightedLabels, setHighlightedLabels),
      takeLatest(AppActions.goToUrl, goToUrl),
      takeLatest(AppActions.clearStorage, clearStorage),
    ]);
  } catch (e) {
    console.error(e);
  }
}

export default AppSaga;
