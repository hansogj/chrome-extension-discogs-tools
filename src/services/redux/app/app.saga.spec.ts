import { AsyncData } from '@swan-io/boxed';
import { testSaga } from 'redux-saga-test-plan';
import { MAX_LOGIN_ATTEMPTS } from '../../../constants';
import { OauthIdentity, User } from '../../../domain';
import * as api from '../../api';
import * as labelService from '../../highlighted.labels.service';
import * as storage from '../../storage';
import * as userTokenService from '../../userToken.service';
import { asyncOk } from '../domain';
import * as appActions from './app.actions';
import {
  clearStorage,
  getHighlightedLabels,
  getUser,
  getView,
  notify,
  setHighlightedLabels,
  setUserToken,
  setView,
  unauthorizedUser,
  warn,
} from './app.saga';
import * as appSelectors from './selectors';
import { DISCOGS_BASE_URL, ERROR } from './types';
const USER_ID = 'USER_ID';
const USER_TOKEN = 'USER_TOKEN';
const IDENTITY: OauthIdentity = {
  id: 123,
  username: 'user name',
  resource_url: 'resource_url',
  consumer_name: 'consumer_name',
};
const USER: User = IDENTITY as unknown as User;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => jest.restoreAllMocks());

describe('app saga', () => {
  describe('getUser', () => {
    it('should retrieve token from storage , call for user and yield updated user', () => {
      testSaga(getUser, undefined)
        .next()
        .put(appActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next(USER_TOKEN)
        .call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`)
        .next(IDENTITY)
        .call(api.fetch, 'resource_url')
        .next(USER)
        .put(appActions.getUser(asyncOk(USER)))
        .next()
        .isDone();
    });

    it('has no stored usertoken y', () => {
      testSaga(getUser, undefined)
        .next()
        .put(appActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next({})
        .next()
        .isDone();
    });

    it(`has no stored usertoken failed ${MAX_LOGIN_ATTEMPTS} times`, () => {
      testSaga(getUser, undefined, MAX_LOGIN_ATTEMPTS)
        .next()
        .put(appActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next({})
        .next(appActions.getUser(unauthorizedUser))
        .next()
        .next()
        .isDone();
    });

    it('when fail, should retry', () => {
      testSaga(getUser, undefined)
        .next()
        .put(appActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next(USER_TOKEN)
        .call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`)
        .next(undefined)
        .next()
        .isDone();
    });
    it(`when failed ${MAX_LOGIN_ATTEMPTS} times, should yield user to be ${ERROR.NOT_AUTHENTICATED}`, () => {
      testSaga(getUser, undefined, MAX_LOGIN_ATTEMPTS)
        .next()
        .put(appActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next(USER_TOKEN)
        .call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`)
        .next(appActions.getUser(unauthorizedUser))
        .next()
        .next()
        .isDone();
    });
  });

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

  describe('setUserToken', () => {
    it('should get user token from service and call getUser generator', () => {
      testSaga(setUserToken, appActions.setUserToken(USER_TOKEN))
        .next()
        .call(userTokenService.set, USER_TOKEN)
        .next()
        .call(getUser, 0)
        .next()
        .isDone();
    });
    it('should remove user token from service and reset user', () => {
      testSaga(setUserToken, appActions.logOut())
        .next()
        .call(userTokenService.remove)
        .next()
        .put(appActions.getUser(AsyncData.NotAsked()))
        .next()
        .isDone();
    });
  });

  describe('setView', () => {
    it('should store item and yield success', () => {
      testSaga(setView, appActions.setView('Artist'))
        .next()
        .call(storage.set, 'view', 'Artist')
        .next()
        .put(appActions.setViewSuccess('Artist'))
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
        .put(appActions.setViewSuccess('Artist'))
        .next()
        .isDone();
    });
    it('should retrieve empty and yield undefined success', () => {
      testSaga(getView)
        .next()
        .call(storage.get, 'view', '')
        .next({})
        .put(appActions.setViewSuccess(undefined))
        .next()
        .isDone();
    });
  });

  describe('setHighlightedLabels', () => {
    const labels = { fair: [] } as any;
    it('should store item and yield success', () => {
      testSaga(setHighlightedLabels, appActions.setHighlightedLabels(labels))
        .next()
        .call(labelService.set, labels)
        .next()
        .put(appActions.setHighlightedLabelsSuccess(labels))
        .next()
        .call(api.applyHighlightedLabels)
        .next()
        .isDone();
    });
  });

  describe('getHighlightedLabels', () => {
    const labels = { fair: [] } as any;
    it('should retrieve item and yield success', () => {
      testSaga(getHighlightedLabels)
        .next()
        .call(labelService.get)
        .next(labels)
        .put(appActions.getHighlightedLabelsSuccess(labels))
        .next()
        .call(api.applyHighlightedLabels)
        .next()
        .isDone();
    });
  });

  describe('clearStorage', () => {
    it('should call storage with all possible keys', () => {
      testSaga(clearStorage)
        .next()

        .select(appSelectors.getUserId)
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
