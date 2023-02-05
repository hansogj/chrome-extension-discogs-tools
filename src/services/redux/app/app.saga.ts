import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
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
  const userId: number = yield select(userSelectors.getUserId);
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
      takeLatest(AppActions.setView, setView),
      takeLatest(AppActions.setHighlightedLabels, setHighlightedLabels),
      takeLatest(AppActions.goToUrl, goToUrl),
      takeLatest(AppActions.clearStorage, clearStorage),
      takeLatest(UserActions.getUser, onUserSuccess),
    ]);
  } catch (e) {
    console.error(e);
  }
}

export default AppSaga;
