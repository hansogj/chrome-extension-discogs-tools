import { Optional } from '@hansogj/maybe';
import { CombinedState } from 'redux';
import { asyncOk } from '../domain';
import { RootState } from '../root.reducers';
import { UserState } from '../user';
import { getAsyncUser, getUserId, getUserState } from './selectors';

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
});
