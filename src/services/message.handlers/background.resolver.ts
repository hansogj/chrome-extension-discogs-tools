import 'regenerator-runtime/runtime.js'
import { ActionTypes } from '../redux'
import { releasePage } from '../releasePage.service'
import * as wanList from '../wantlist.service'
import { MessageActions } from './types'
export const messageResolverFactory =
  () =>
  (
    action: ActionTypes,
    resolver: (prom: Promise<unknown>) => Promise<unknown>,
  ) => {
    if (action.type === MessageActions.SYNC_WANT_LIST)
      return resolver(
        wanList.sync(action.userId as number, action.body as string),
      )

    if (action.type === MessageActions.GET_RELEASE_PAGE_ITEM_ID)
      return resolver(releasePage(action.body as string))
    else
      return resolver(
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `action ${action.type} not resolved in background message hander`,
                ),
              ),
            5000,
          ),
        ),
      )
  }
