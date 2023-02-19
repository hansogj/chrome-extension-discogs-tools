import { Async } from '../domain';
import { ActionDataTypes } from '../types';

export interface UserState {
  readonly user: Async.User;
}

export enum USER_ERROR {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  MISSING_TOKEN = 'MISSING_TOKEN',
}

export type UserActionData = Mutable<UserState> & {
  identity: Optional<string>;
  userToken: Optional<string>;
};

export enum UserActions {
  GET_IDENTITY = 'GET_IDENTITY',
  GET_IDENTITY_SUCCESS = 'GET_IDENTITY_SUCCESS',
  GET_USER_INIT = 'GET_USER_INIT',
  GET_USER = 'GET_USER',
  SET_USER_TOKEN = 'SET_USER_TOKEN',
  SET_USER_TOKEN_SUCCESS = 'SET_USER_TOKEN_SUCCESS',
  USER_LOG_OUT = 'USER_LOG_OUT',
}

export type UserActionTypes = ActionDataTypes<UserActions, UserActionData>;

export type UserResourceField =
  | 'collection_folders_url'
  | 'collection_fields_url'
  | 'inventory_url'
  | 'wantlist_url';
