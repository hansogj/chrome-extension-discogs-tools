import { AsyncData } from '@swan-io/boxed';
import { testSaga } from 'redux-saga-test-plan';
import { DISCOGS_BASE_URL, MAX_LOGIN_ATTEMPTS } from '../../../constants';
import { OauthIdentity, User } from '../../../domain';
import * as api from '../../api';
import * as userTokenService from '../../userToken.service';
import { asyncOk } from '../domain';
import { UserResourceField, USER_ERROR } from './types';
import * as userActions from './user.actions';

import { selectors as userSelectors } from '.';
import { actions as appActions, sagas as appSagas } from '../app';
import { fetchUserResource, getUser, setUserToken, unauthorizedUser } from './user.saga';

jest.mock('../../api', () => ({
  __esModule: true,
  post: jest.fn,
  fetch: jest.fn,
  reload: jest.fn,
}));

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

describe('user saga', () => {
  const error = 'Failing when reach for api';
  const warn = appActions.warn({ error });
  describe('getUser', () => {
    it('should retrieve token from storage , call for user and yield updated user', () => {
      testSaga(getUser, undefined)
        .next()
        .put(userActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next(USER_TOKEN)
        .call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`)
        .next(IDENTITY)
        .call(api.fetch, 'resource_url')
        .next(USER)
        .put(userActions.getUser(asyncOk(USER)))
        .next()
        .isDone();
    });

    it(`has no stored user token and count is less than ${MAX_LOGIN_ATTEMPTS}`, () => {
      testSaga(getUser, undefined, MAX_LOGIN_ATTEMPTS - 1)
        .next()
        .put(userActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next({})
        .put(userActions.getUser(AsyncData.NotAsked()))
        .next()
        .next()
        .isDone();
    });

    it('when fail, should retry', () => {
      testSaga(getUser, undefined)
        .next()
        .put(userActions.getUser(AsyncData.Loading()))
        .next()
        .call(userTokenService.get)
        .next(USER_TOKEN)
        .call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`)
        .next(undefined)
        .put(userActions.getUser(AsyncData.NotAsked()))
        .next()
        .next(appSagas.warn, warn)
        .isDone();
    });
  });

  describe('setUserToken', () => {
    it('should get user token from service and call getUser generator', () => {
      testSaga(setUserToken, userActions.setUserToken(USER_TOKEN))
        .next()
        .call(userTokenService.set, USER_TOKEN)
        .next()
        .call(getUser, 0)
        .next()
        .isDone();
    });
    it('should remove user token from service and reset user', () => {
      testSaga(setUserToken, userActions.logOut())
        .next()
        .call(userTokenService.remove)
        .next()
        .put(userActions.getUser(AsyncData.NotAsked()))
        .next()
        .isDone();
    });
  });

  describe('fetchUserResource', () => {
    const inspect = (e: any, field: string) => {
      expect(e.type).toEqual('SELECT');
      expect(userSelectors.fromUser).toHaveBeenCalledWith(field);
      return field + '/url';
    };

    beforeEach(() =>
      jest.spyOn(userSelectors, 'fromUser').mockReturnValue((() => 'resource') as any),
    );
    it.each([
      ['collection_folders_url' as UserResourceField],
      ['collection_fields_url' as UserResourceField],
      ['inventory_url' as UserResourceField],
      ['wantlist_url' as UserResourceField],
    ])('when selector %j and api responds with undefined', (field: UserResourceField) => {
      const resource = field + '/url';

      testSaga(fetchUserResource, field)
        .next()
        .inspect((e: any) => inspect(e, field))
        .next(resource)

        .call(api.fetch, resource, undefined)
        .next(undefined)
        .put(warn)
        .next()
        .isDone();
    });

    it.each([['not_a_prop' as UserResourceField], ['collection_fields_url' as UserResourceField]])(
      'when selector %j and  %j is not part of User (or user not yet loaded) should get user',
      (field: UserResourceField) => {
        testSaga(fetchUserResource, field)
          .next()
          .inspect((e: any) => undefined)
          .next(undefined)
          .call(getUser, undefined, 0)
          .next()
          .isDone();
      },
    );

    it.each([
      ['collection_folders_url', { folders: 'folders' }],
      ['collection_fields_url', { fields: 'fields' }],
      ['inventory_url', { inventory: 'inventory' }],
      ['wantlist_url', { wantlist: 'wantlist' }],
    ])('when selector %j responds %s, should yield %j', (field: string, response: any) => {
      testSaga(fetchUserResource, field as UserResourceField)
        .next()
        .inspect(() => field + '/url')
        .next(field + '/url')
        .call(api.fetch, field + '/url', undefined)
        .next(response)
        .returns(response);
    });

    it.each([
      ['collection_folders_url'],
      ['collection_fields_url'],
      ['inventory_url'],
      ['wantlist_url'],
    ])('when selector %j responds %s, should yield %j', (field: string) => {
      testSaga(fetchUserResource, field as UserResourceField)
        .next()
        .inspect(() => field + '/url')
        .next(field + '/url')
        .call(api.fetch, field + '/url', undefined)
        .throw(new Error('cannot reach ' + field + '/url'))
        .put(appActions.warn({ error: 'cannot reach ' + field + '/url' }))
        .next()
        .isDone();
    });
  });
});
