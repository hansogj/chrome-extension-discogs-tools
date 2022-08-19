import { API_TIMEOUT, isProduction } from '../../constants'
import domResolver from '../../content/dom'
import { Version } from '../../domain'
import * as highlightedLabelsService from '../highlighted.labels.service'
import { ActionTypes } from '../redux'
import { DiscogsActions } from '../redux/discogs'
import * as versionsService from '../versions.service'
import getMockRelease from '../__mock__/release.in.view'
import { MessageActions, MessageResover } from './types'

import * as xhr from '../xhr'

export const messageResolverFactory =
  (): MessageResover =>
  (
    action: ActionTypes,
    resolver: (prom: Promise<unknown>) => Promise<unknown>,
  ) => {
    if (action.type === MessageActions.DOM)
      return resolver(
        domResolver(action.body as DiscogsActions, action.resource!),
      )

    if (action.type === MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT) {
      return resolver(
        versionsService.getAllWantedVersionsByFormat(
          action.resource!,
          action.body as Optional<Version['format']>,
        ),
      )
    }

    if (action.type === MessageActions.post) {
      return resolver(
        xhr.post(action.resource!, action.body as SearchParams & PayLoad),
      )
    }
    if (action.type === MessageActions.fetch)
      return resolver(xhr.fetch(action.resource!, action.body as SearchParams))

    if (action.type === MessageActions.put) {
      return resolver(
        xhr.put(action.resource!, action.body as SearchParams & PayLoad),
      )
    }

    if (action.type === MessageActions.deleteResource) {
      return resolver(xhr.deleteResource(action.resource!))
    }

    if (action.type === MessageActions.APPLY_HIGHLIGHTED_LABELS) {
      return resolver(highlightedLabelsService.apply())
    }

    if (action.type === MessageActions.GET_CURRENT_URL)
      return resolver(
        Promise.resolve(isProduction ? window.location.href : getMockRelease()),
      )

    if (action.type === MessageActions.WINDOW_RELOAD) window.location.reload()
    else
      return resolver(
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  `action ${action.type} not resolved in content message hander`,
                ),
              ),
            API_TIMEOUT,
          ),
        ),
      )
  }
