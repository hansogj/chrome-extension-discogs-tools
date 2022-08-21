import { ResourceUrl } from '../../domain';
import { ActionTypes as ReduxActinTypes } from './../redux/types';
import { MessageActionMatcher } from './MessageActionMatcher';

export type MessageResolver = (actionMatcher: MessageActionMatcher) => Promise<unknown>;

export interface MessageActionData {
  body?: unknown;
  resource: ResourceUrl;
  userId?: number;
}

export enum MessageActions {
  fetch = 'FETCH',
  post = 'POST',
  put = 'PUT',
  deleteResource = 'DELETE_RESOURCE',

  DOM = 'DOM',
  SYNC_WANT_LIST = 'SYNC_WANT_LIST',
  GET_RELEASE_PAGE_ITEM_ID = 'GET_RELEASE_PAGE_ITEM_ID',
  WINDOW_RELOAD = 'WINDOW_RELOAD',
  GET_CURRENT_URL = 'GET_CURRENT_URL',
  REMOVE_ALL_WANTED_VERSIONS_OF_ITEM = 'REMOVE_ALL_WANTED_VERSIONS_OF_ITEM',
  GET_ALL_WANTED_VERSIONS_OF_ITEM = 'GET_ALL_WANTED_VERSIONS_OF_ITEM',
  GET_ALL_WANTED_VERSIONS_BY_FORMAT = 'GET_ALL_WANTED_VERSIONS_BY_FORMAT',
  APPLY_HIGHLIGHTED_LABELS = 'APPLY_HIGHLIGHTED_LABELS',
  WANT_LIST_IS_SYNCING = 'WANT_LIST_IS_SYNCING',
}

export type MessageActionTypes = ReduxActinTypes<MessageActions, MessageActionData>;
