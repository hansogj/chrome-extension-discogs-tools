import { Async } from '../domain';
import { ActionTypes } from '../types';

export interface UserState {
  readonly user: Async.User;
}

export enum USER_ERROR {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  MISSING_TOKEN = 'MISSING_TOKEN',
}

export interface UserActionData {
  identity: Optional<string>;
  user: Async.User;
  userToken: Optional<string>;
}

export enum UserActions {
  getIdentity = 'GET_IDENTITY',
  getIdentitySuccess = 'GET_IDENTITY_SUCCESS',
  getUserInit = 'GET_USER_INIT',
  getUser = 'GET_USER',
  setUserToken = 'SET_USER_TOKEN',
  setUserTokenSuccess = 'SET_USER_TOKEN_SUCCESS',
  logOut = 'APP_LOG_OUT',
}

export type UserActionTypes = ActionTypes<UserActions, UserActionData>;

export type UserResourceField =
  | 'collection_folders_url'
  | 'collection_fields_url'
  | 'inventory_url'
  | 'wantlist_url';
