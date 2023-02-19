import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { NOTIFICATION_TIMEOUT } from '../../../constants';
import { HighlightedLabels, Release } from '../../../domain';
import * as api from '../../api';
import * as labelService from '../../highlighted.labels.service';

import * as storage from '../../storage';
import { empty } from '../../utils/json.utils';
import { DiscogsActions } from '../discogs';
import { selectors as userSelectors, UserActions, UserActionTypes } from '../user';
import { AppActions, AppActionTypes, View } from './';
import * as actions from './app.actions';

import { ActionButton } from './types';

export function* notify(message: string, actionBtn?: ActionButton, timeout = NOTIFICATION_TIMEOUT) {
  yield put(actions.notify({ message, actionBtn }));
  yield delay(timeout);
  yield put(actions.notifyReset());
}

export function* warn(message: string, timeout = NOTIFICATION_TIMEOUT) {
  yield put(actions.warn({ message }));
  yield delay(timeout);
  yield put(actions.notifyReset());
}

export function* setView({ view }: AppActionTypes) {
  yield call(storage.set, 'view', view);
  yield put(actions.setViewSuccess({ view }!));
}

export function* getView() {
  const view: View = yield call(storage.get, 'view', '');
  yield put(actions.setViewSuccess(!empty(view) ? { view } : undefined));
}

export function* setHighlightedLabels({ highlightedLabels }: AppActionTypes) {
  try {
    yield call(labelService.set, highlightedLabels!);
    yield put(actions.setHighlightedLabelsSuccess({ highlightedLabels }));
    yield call(api.applyHighlightedLabels);
  } catch (e) {}
}

export function* getHighlightedLabels() {
  try {
    const highlightedLabels: HighlightedLabels = yield call(labelService.get);
    if (highlightedLabels) {
      yield put(actions.getHighlightedLabelsSuccess({ highlightedLabels }));
      yield call(api.applyHighlightedLabels);
    }
  } catch (e) {}
}

export function* clearStorage() {
  const userId: number = yield select(userSelectors.getUserId);
  const { remove, uniqueKey } = storage;
  yield call(remove, 'view');
  yield call(remove, 'highlighted-labels');
  yield call(remove, uniqueKey('user-collection', userId));
  yield call(remove, uniqueKey('selected-fields', userId));
  yield call(remove, uniqueKey('want-list', userId));
}

function* getWindowUrl() {
  let windowUrl: URL = yield call(api.getWindowLocation);
  yield put(actions.windowUrlRetrieved({ windowUrl }));
}

function* onUserSuccess({ user }: UserActionTypes) {
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
      takeLatest(AppActions.APP_SET_VIEW, setView),
      takeLatest(AppActions.APP_SET_HIGHLIGHTED_LABELS, setHighlightedLabels),
      takeLatest(AppActions.APP_GO_TO_URL, goToUrl),
      takeLatest(AppActions.APP_CLEAR_STORAGE, clearStorage),
      takeLatest(UserActions.GET_USER, onUserSuccess),
    ]);
  } catch (e) {
    console.error(e);
  }
}

export default AppSaga;
