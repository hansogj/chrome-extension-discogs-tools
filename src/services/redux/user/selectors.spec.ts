import { Optional } from '@hansogj/maybe';
import { CombinedState } from 'redux';
import { asyncOk } from '../domain';
import { RootState } from '../root.reducers';
import { UserState } from '../user';
import {
  getAsyncUser,
  getFieldsResource,
  getFoldersResource,
  getInventoryResource,
  getUserId,
  getUserLoaded,
  getUserState,
  getWantListResource,
} from './selectors';
import { user as userMock } from './_mocks_/index';

type State = Partial<CombinedState<UserState>>;
describe('User selectors', () => {
  describe.each([
    [undefined, undefined as any],
    [{}, undefined as any],
    [{ User: 'User' }, 'User'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with RootState %j', (rootState, expected) => {
    it(`getUserState should be ${expected}`, () =>
      expect(getUserState(rootState as State)).toBe(expected));
  });

  describe.each([
    [{ User: {} }, undefined as any],
    [{ User: { user: 'user' } }, 'user'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with UserState %j', (userState, expected) => {
    it(`getUser should be ${expected}`, () =>
      expect(getAsyncUser(userState as State)).toBe(expected));
  });

  describe.each([
    [{ User: {} }, undefined as any],
    [{ User: { user: {} } }, undefined],
    [{ User: { user: asyncOk({ id: 123 }) } }, 123],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with UserState %j', (userState, expected) => {
    it(`getUserId should be ${expected}`, () =>
      expect(getUserId(userState as State)).toBe(expected));
  });

  describe.each([
    [{ User: {} }, undefined as any],
    [{ User: { user: {} } }, undefined],
    [{ User: { user: asyncOk('user') } }, 'user'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with UserState %j', (userState, expected) => {
    it(`getUserLoaded should be ${expected}`, () =>
      expect(getUserLoaded(userState as State)).toBe(expected));
  });

  describe('fromUser', () => {
    let state: RootState;
    beforeEach(
      () =>
        (state = {
          User: {
            user: asyncOk(userMock),
          },
        } as any as RootState),
    );
    it(`getUserId should give ${userMock.id}`, () => expect(getUserId(state)).toEqual(userMock.id));
    it(`getFoldersResource should give ${userMock.collection_folders_url}`, () =>
      expect(getFoldersResource(state)).toEqual(userMock.collection_folders_url));
    it(`getFieldsResource should give ${userMock.collection_fields_url}`, () =>
      expect(getFieldsResource(state)).toEqual(userMock.collection_fields_url));
    it(`getInventoryResource should give ${userMock.inventory_url}`, () =>
      expect(getInventoryResource(state)).toEqual(userMock.inventory_url));
    it(`getWantListResource should give ${userMock.wantlist_url}`, () =>
      expect(getWantListResource(state)).toEqual(userMock.wantlist_url));
  });
});
