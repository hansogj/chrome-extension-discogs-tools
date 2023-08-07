import 'regenerator-runtime/runtime.js';
import * as collection from '../collection.service';
import { ActionTypes } from '../redux';
import * as wanList from '../wantlist.service';
import { MessageActionMatcher } from './MessageActionMatcher';
import { MessageActions, MessageActionTypes, MessageResolver } from './types';

export const messageResolverFactory = (): MessageResolver => (action: ActionTypes) =>
  new MessageActionMatcher(action, 'background')
    .matcher(MessageActions.SYNC_WANT_LIST, (action: MessageActionTypes) =>
      wanList.sync(action.userId as number, action.body as string),
    )

    .matcher(MessageActions.SYNC_COLLECTION, (action: MessageActionTypes) =>
      collection.sync(action.userId as number, action.body as string),
    )

    .matcher(MessageActions.GET_SYNC_STATUS, () =>
      Promise.all([wanList.isSyncing(), collection.isSyncing()]).then(([wantList, collection]) => ({
        wantList,
        collection,
      })),
    )
    .resolve();
