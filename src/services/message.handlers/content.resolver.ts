import { API_TIMEOUT, isProduction } from '../../constants'
import domResolver from '../../content/dom'
import { HightlightedLabels, Version } from '../../domain'
import { ActionTypes } from '../redux'
import { DiscogsActions } from '../redux/discogs'
import * as versionsService from '../versions.service'
import * as highlightedLabelsService from '../highlighted.labels.service'
import getMockRelease from '../__mock__/release.in.view'
import { MessageActions, MessageResover } from './types'

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

    if (action.type === MessageActions.APPLY_HIGHTLIGHTED_LABELS) {
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
