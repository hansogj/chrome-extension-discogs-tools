import 'regenerator-runtime/runtime.js'
import { ActionTypes } from '../redux'
import * as wantlist from '../wantlist.service'
import * as xhr from '../xhr'
import { MessageActions } from './types'
import { releasePage } from '../releasePage.service'
export const messageResolverFactory =
  () =>
  (
    action: ActionTypes,
    resolver: (prom: Promise<unknown>) => Promise<unknown>,
  ) => {
    if (action.type === MessageActions.fetch)
      return resolver(xhr.fetch(action.resource!, action.body as SearchParams))

    if (action.type === MessageActions.post) {
      return resolver(
        xhr.post(action.resource!, action.body as SearchParams & PayLoad),
      )
    }

    if (action.type === MessageActions.put) {
      return resolver(
        xhr.put(action.resource!, action.body as SearchParams & PayLoad),
      )
    }

    if (action.type === MessageActions.deleteResource) {
      return resolver(xhr.deleteResource(action.resource!))
    }

    if (action.type === MessageActions.SYNC_WANT_LIST)
      return resolver(
        wantlist.sync(action.userId as number, action.body as string),
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
