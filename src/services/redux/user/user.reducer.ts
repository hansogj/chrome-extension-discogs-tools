import { AsyncData } from '@swan-io/boxed';
import { passReducer, reducerForProducers } from '../../../gist/immer-utils/immer.utils';
import { UserActions, UserActionTypes, UserState } from './types';

export const initialState: UserState = {
  user: AsyncData.NotAsked(),
};

// prettier-ignore
const { GET_USER, GET_IDENTITY, GET_IDENTITY_SUCCESS, GET_USER_INIT, SET_USER_TOKEN, SET_USER_TOKEN_SUCCESS, USER_LOG_OUT, } = UserActions;

const userReducer = reducerForProducers<UserState, UserActionTypes, UserActions>(initialState, {
  [GET_USER]: (draft, action) => {
    draft.user = action.user ? action.user : draft.user;
  },

  [GET_IDENTITY]: passReducer,
  [GET_IDENTITY_SUCCESS]: passReducer,
  [GET_USER_INIT]: passReducer,
  [SET_USER_TOKEN]: passReducer,
  [SET_USER_TOKEN_SUCCESS]: passReducer,
  [USER_LOG_OUT]: passReducer,
});

export default userReducer;
