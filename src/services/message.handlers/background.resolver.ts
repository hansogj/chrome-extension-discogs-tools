import { ActionTypes } from '../redux'
import * as xhr from '../xhr'
import { MessageActions } from './types'

import 'regenerator-runtime/runtime.js'

export const messageResolverFactory =
  () =>
  (
    action: ActionTypes,
    resolver: (prom: Promise<unknown>) => Promise<unknown>,
  ) => {
    console.info('background message received ', action)
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
    } else
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
