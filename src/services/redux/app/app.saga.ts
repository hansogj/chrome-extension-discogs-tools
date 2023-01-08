import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { MAX_LOGIN_ATTEMPTS } from '../../../constants';
import { HighlightedLabels, OauthIdentity, User, Release } from '../../../domain';
import * as api from '../../api';
import * as labelService from '../../highlighted.labels.service';

import * as storage from '../../storage';
import * as userTokenService from '../../userToken.service';
import { empty } from '../../utils/json.utils';
import { DiscogsActions } from '../discogs';
import * as appSelectors from './selectors';
import { AppActions, AppActionTypes, DISCOGS_BASE_URL, View } from './';
import * as actions from './app.actions';
import { ActionButton, ERROR } from './types';
import { AsyncData } from '@swan-io/boxed';
import { asyncError, asyncOk } from '../domain';
import { getText } from '../../texts';

export const unauthorizedUser = asyncError({
  error: ERROR.NOT_AUTHENTICATED,
  message: getText('log.inn.error'),
  isError: true,
});

export function* getUser(_: any, count = 0): any {
  console.log(count);
  try {
    yield put(actions.getUser(AsyncData.Loading()));
    const storedToken: string = yield call(userTokenService.get);
    if (!Boolean(storedToken) || empty(storedToken)) throw new Error(ERROR.NOT_AUTHENTICATED);
    const identity: OauthIdentity = yield call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`);
    if (identity) {
      const user: User = yield call(api.fetch, identity.resource_url);

      yield put(actions.getUser(asyncOk(user)));
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
      yield put(actions.getUser(unauthorizedUser));
    }
  }
}

export function* getUserId() {
  console.warn('stop using this - use selector in consuming saga instead');
  const userId: number = yield select(appSelectors.getUserId);

  if (userId) {
    yield userId;
    return userId;
  } else {
    yield put(actions.getUser(unauthorizedUser));
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

export function* setUserToken({ userToken }: AppActionTypes) {
  if (userToken) {
    yield call(userTokenService.set, userToken!);
    yield call(getUser, 0);
  } else {
    yield call(userTokenService.remove);
    yield put(actions.getUser(AsyncData.NotAsked()));
  }
}

export function* setView({ view }: AppActionTypes) {
  yield call(storage.set, 'view', view);
  yield put(actions.setViewSuccess(view!));
}

export function* getView() {
  const view: View = yield call(storage.get, 'view', '');
  yield put(actions.setViewSuccess(empty(view) ? undefined : view));
}

export function* setHighlightedLabels({ highlightedLabels: labels }: AppActionTypes) {
  try {
    yield call(labelService.set, labels!);
    yield put(actions.setHighlightedLabelsSuccess(labels as HighlightedLabels));
    yield call(api.applyHighlightedLabels);
  } catch (e) {}
}

export function* getHighlightedLabels() {
  try {
    const labels: HighlightedLabels = yield call(labelService.get);
    if (labels) {
      yield put(actions.getHighlightedLabelsSuccess(labels));
      yield call(api.applyHighlightedLabels);
    }
  } catch (e) {}
}

export function* clearStorage() {
  const userId: number = yield select(appSelectors.getUserId);
  const { remove, uniqueKey } = storage;
  yield call(remove, 'view');
  yield call(remove, 'highlighted-labels');
  yield call(remove, uniqueKey('user-collection', userId));
  yield call(remove, uniqueKey('selected-fields', userId));
  yield call(remove, uniqueKey('want-list', userId));
}

function* getWindowUrl() {
  let url: URL = yield call(api.getWindowLocation);
  yield put(actions.windowUrlRetrieved(url as URL));
}

function* onUserSuccess({ user }: AppActionTypes) {
  if (user?.isDone() && user?.get().isOk()) {
    yield all([getView(), getHighlightedLabels(), getWindowUrl()]);
  }
}

function* goToUrl({ url }: AppActionTypes) {
  try {
    const { uri }: Release.DTO = yield call(api.fetch, `${url}`);
    yield api.manipulateDom(DiscogsActions.domGoTo, uri);
  } catch (error) {
    yield api.manipulateDom(DiscogsActions.domGoTo, `${url}`);
  }
}

function* AppSaga() {
  try {
    yield all([
      takeLatest(AppActions.logOut, setUserToken),
      takeLatest(AppActions.setUserToken, setUserToken),
      takeLatest(AppActions.setUserTokenSuccess, getUser),
      takeLatest(AppActions.setView, setView),
      takeLatest(AppActions.getUser, onUserSuccess),
      takeLatest(AppActions.setHighlightedLabels, setHighlightedLabels),
      takeLatest(AppActions.goToUrl, goToUrl),
      takeLatest(AppActions.clearStorage, clearStorage),
    ]);
  } catch (e) {
    console.error(e);
  }
  yield call(getUser, undefined);
}

export default AppSaga;
