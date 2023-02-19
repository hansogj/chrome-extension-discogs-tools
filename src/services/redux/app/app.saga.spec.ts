import { testSaga } from 'redux-saga-test-plan';
import * as api from '../../api';
import * as labelService from '../../highlighted.labels.service';
import * as storage from '../../storage';
import { selectors as userSelectors } from '../user';
import * as appActions from './app.actions';
import {
  clearStorage,
  getHighlightedLabels,
  getView,
  notify,
  setHighlightedLabels,
  setView,
  warn,
} from './app.saga';

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => jest.restoreAllMocks());

describe('app saga', () => {
  describe('notify', () => {
    it('should dispatch message and reset', () => {
      testSaga(notify, 'message')
        .next()

        .put(appActions.notify({ message: 'message' }))
        .next()
        .delay(5000)
        .next()
        .put(appActions.notifyReset())
        .next()
        .isDone();
    });
  });

  describe('warn', () => {
    it('should dispatch message and reset', () => {
      testSaga(warn, 'message')
        .next()
        .put(appActions.warn({ message: 'message' }))
        .next()
        .delay(5000)
        .next()
        .put(appActions.notifyReset())
        .next()
        .isDone();
    });
  });

  describe('setView', () => {
    it('should store item and yield success', () => {
      testSaga(setView, appActions.setView({ view: 'Artist' }))
        .next()
        .call(storage.set, 'view', 'Artist')
        .next()
        .put(appActions.setViewSuccess({ view: 'Artist' }))
        .next()
        .isDone();
    });
  });

  describe('getView', () => {
    it('should retrieve item and yield success', () => {
      testSaga(getView)
        .next()
        .call(storage.get, 'view', '')
        .next('Artist')
        .put(appActions.setViewSuccess({ view: 'Artist' }))
        .next()
        .isDone();
    });
    it('should retrieve empty and yield undefined success', () => {
      testSaga(getView)
        .next()
        .call(storage.get, 'view', '')
        .next({})
        .put(appActions.setViewSuccess())
        .next()
        .isDone();
    });
  });

  describe('setHighlightedLabels', () => {
    const highlightedLabels = { fair: [] } as any;
    it('should store item and yield success', () => {
      testSaga(setHighlightedLabels, appActions.setHighlightedLabels({ highlightedLabels }))
        .next()
        .call(labelService.set, highlightedLabels)
        .next()
        .put(appActions.setHighlightedLabelsSuccess({ highlightedLabels }))
        .next()
        .call(api.applyHighlightedLabels)
        .next()
        .isDone();
    });
  });

  describe('getHighlightedLabels', () => {
    const highlightedLabels = { fair: [] } as any;
    it('should retrieve item and yield success', () => {
      testSaga(getHighlightedLabels)
        .next()
        .call(labelService.get)
        .next(highlightedLabels)
        .put(appActions.getHighlightedLabelsSuccess({ highlightedLabels }))
        .next()
        .call(api.applyHighlightedLabels)
        .next()
        .isDone();
    });
  });

  describe('clearStorage', () => {
    const USER_ID = 'USER_ID';
    it('should call storage with all possible keys', () => {
      testSaga(clearStorage)
        .next()

        .select(userSelectors.getUserId)
        .next(USER_ID)
        .call(storage.remove, 'view')
        .next()
        .call(storage.remove, 'highlighted-labels')
        .next()
        .call(storage.remove, 'user-collection-' + USER_ID)
        .next()
        .call(storage.remove, 'selected-fields-' + USER_ID)
        .next()
        .call(storage.remove, 'want-list-' + USER_ID)
        .next()
        .isDone();
    });
  });
});
