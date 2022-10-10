import 'regenerator-runtime/runtime.js';
import { ActionTypes } from '../redux';
import * as wanList from '../wantlist.service';
import * as collection from '../collection.service';
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

    .matcher(MessageActions.WANT_LIST_IS_SYNCING, () =>
      Promise.all([wanList.isSyncing(), collection.isSyncing()]).then((res) => res.some(Boolean)),
    )
    .resolve();
