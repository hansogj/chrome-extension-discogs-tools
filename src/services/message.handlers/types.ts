import { ResourceUrl } from '../../domain'
import { ActionTypes } from '../redux'
import { ActionTypes as ReduxActinTypes } from './../redux/types'

export type MessageResover = (
  action: ActionTypes,
  resolver: (prom: Promise<unknown>) => Promise<unknown>,
) => void

export interface MessageActionData {
  body?: unknown
  resource: ResourceUrl
  userId?: number
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
  APPLY_HIGHTLIGHTED_LABELS = 'APPLY_HIGHTLIGHTED_LABELS',
}

export type MessageActionTypes = ReduxActinTypes<
  MessageActions,
  MessageActionData
>
