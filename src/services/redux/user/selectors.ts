import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { User } from '../../../domain';
import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';
import { getLoadedResult } from '../domain';
import { RootState } from '../root.reducers';
import { UserState } from '../user';

export const getUserState = (state: Partial<RootState>): UserState =>
  selectFromRoot(state, 'User')!;

export const fromUserState = <Key extends keyof UserState>(prop: Key) =>
  createSelector(getUserState, (userState) => maybe(userState).mapTo(prop).valueOr(undefined));

export const getAsyncUser = createSelector(getUserState, (userState) =>
  maybe(userState).mapTo('user').valueOr(undefined),
);
export const getUserLoaded = createSelector(getAsyncUser, (user) =>
  maybe(user).map(getLoadedResult).valueOr(undefined),
);

export const fromUser = <Key extends keyof User>(prop: Key) =>
  createSelector(getUserLoaded, (user) =>
    maybe(user as User)
      .mapTo(prop)
      .valueOr(undefined),
  );

export const getUserId = fromUser('id');

export const getFoldersResource = fromUser('collection_folders_url');
export const getFieldsResource = fromUser('collection_fields_url');
export const getInventoryResource = fromUser('inventory_url');
export const getWantListResource = fromUser('wantlist_url');
