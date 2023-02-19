import { ResourceUrl } from '../../domain';
import { ActionTypes } from '../redux';
import { ActionDataTypes } from './../redux/types';

export type MessageResolver = (action: ActionTypes) => Promise<unknown>;

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
  WINDOW_RELOAD = 'WINDOW_RELOAD',
  GET_CURRENT_URL = 'GET_CURRENT_URL',
  REMOVE_ALL_WANTED_VERSIONS_OF_ITEM = 'REMOVE_ALL_WANTED_VERSIONS_OF_ITEM',
  GET_ALL_WANTED_VERSIONS_OF_ITEM = 'GET_ALL_WANTED_VERSIONS_OF_ITEM',
  GET_ALL_WANTED_VERSIONS_BY_FORMAT = 'GET_ALL_WANTED_VERSIONS_BY_FORMAT',
  APPLY_HIGHLIGHTED_LABELS = 'APPLY_HIGHLIGHTED_LABELS',
  HAS_ONGOING_SYNC = 'HAS_ONGOING_SYNC',
  SYNC_COLLECTION = 'SYNC_COLLECTION',
}

export type MessageActionTypes = ActionDataTypes<MessageActions, MessageActionData>;
