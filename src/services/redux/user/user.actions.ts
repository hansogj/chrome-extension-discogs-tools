import { AsyncData } from '@swan-io/boxed';
import { Async } from '../domain';
import { UserActions, UserActionTypes } from './types';

export const getUserInit = (): UserActionTypes => ({
  type: UserActions.getUserInit,
});

export const getUser = (user: Async.User): UserActionTypes => ({
  type: UserActions.getUser,
  user,
});

export const logOut = (): UserActionTypes => ({
  type: UserActions.logOut,
  user: AsyncData.NotAsked(),
});

export const setUserToken = (userToken: string): UserActionTypes => ({
  type: UserActions.setUserToken,
  userToken,
});

export const setUserTokenSuccess = (): UserActionTypes => ({
  type: UserActions.setUserTokenSuccess,
});

export const getIdentity = (): UserActionTypes => ({
  type: UserActions.getIdentity,
});

export const getIdentitySuccess = (identity: string): UserActionTypes => ({
  type: UserActions.getIdentitySuccess,
  identity,
});
