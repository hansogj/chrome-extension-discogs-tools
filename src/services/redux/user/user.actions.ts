import { AsyncData } from '@swan-io/boxed';
import { toAction } from '../utils';
import { UserActionData, UserActions, UserActionTypes } from './types';

// prettier-ignore
const { GET_USER, GET_IDENTITY, GET_IDENTITY_SUCCESS, GET_USER_INIT, SET_USER_TOKEN, SET_USER_TOKEN_SUCCESS, USER_LOG_OUT, } = UserActions;

const toUserAction =
  (type: UserActions) =>
  (data: Partial<UserActionData> = {}) =>
    toAction<UserActions, Partial<UserActionData>>(type, data);

export const getUser = toUserAction(GET_USER);
export const setUserToken = toUserAction(SET_USER_TOKEN);
export const logOut = (): UserActionTypes => ({
  type: USER_LOG_OUT,
  user: AsyncData.NotAsked(),
});

// TODO REMOVE
export const getUserInit = toUserAction(GET_USER_INIT);
export const setUserTokenSuccess = toUserAction(SET_USER_TOKEN_SUCCESS);
export const getIdentity = toUserAction(GET_IDENTITY);
export const getIdentitySuccess = toUserAction(GET_IDENTITY_SUCCESS);
