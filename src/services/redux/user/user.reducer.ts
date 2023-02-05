import { AsyncData } from '@swan-io/boxed';
import { reducerForProducers } from '../../../gist/immer-utils/immer.utils';
import { UserActions, UserActionTypes, UserState } from './types';

export const initialState: UserState = {
  user: AsyncData.NotAsked(),
};

const discogsReducer = reducerForProducers<UserState, UserActionTypes, UserActions>(initialState, {
  [UserActions.getUser]: (draft, action) => {
    draft.user = action.user ? action.user : draft.user;
  },
});

export default discogsReducer;
