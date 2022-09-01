import 'regenerator-runtime/runtime.js';
import { releasePage } from '../releasePage.service';
import * as wanList from '../wantlist.service';
import { MessageActionMatcher } from './MessageActionMatcher';
import { MessageActions, MessageActionTypes, MessageResolver } from './types';
import { ActionTypes } from '../redux';

export const messageResolverFactory = (): MessageResolver => (action: ActionTypes) =>
  new MessageActionMatcher(action, 'background')
    .matcher(MessageActions.SYNC_WANT_LIST, (action: MessageActionTypes) =>
      wanList.sync(action.userId as number, action.body as string),
    )
    .matcher(MessageActions.WANT_LIST_IS_SYNCING, () => wanList.isSyncing())
    .matcher(MessageActions.GET_RELEASE_PAGE_ITEM_ID, (action: MessageActionTypes) =>
      releasePage(action.body as string),
    )
    .resolve();
