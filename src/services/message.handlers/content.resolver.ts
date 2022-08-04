import { API_TIMEOUT } from '../../constants'
import domResolver from '../../content/dom'
import { HightlightedLabels, Version } from '../../domain'
import { SelectedFields } from '../../domain/Inventory'
import * as api from '../api'
import { ActionTypes } from '../redux'
import { DiscogsActions } from '../redux/discogs'
import { releasePage } from '../release.page'
import { Services, MessageActions, MessageResover } from './types'

export const messageResolverFactory =
  (services: Services): MessageResover =>
  (
    action: ActionTypes,
    resolver: (prom: Promise<unknown>) => Promise<unknown>,
  ) => {
    if (action.type === MessageActions.setUserToken)
      return resolver(api.setUserToken(action.body as string))

    if (action.type === MessageActions.DOM)
      return resolver(
        domResolver(action.body as DiscogsActions, action.resource!),
      )

    if (action.type === MessageActions.GET_WANT_LIST)
      return resolver(services.wantList.get(action.userId as number))
    if (action.type === MessageActions.SYNC_WANT_LIST)
      return resolver(
        services.wantList.sync(action.userId as number, action.body as string),
      )

    if (action.type === MessageActions.GET_SELECTED_FIELDS)
      return resolver(services.fields.get(action.userId as number))
    if (action.type === MessageActions.SET_SELECTED_FIELDS)
      return resolver(
        services.fields.set(
          action.userId as number,
          action.body as SelectedFields,
        ),
      )

    if (action.type === MessageActions.GET_ALL_WANTED_VERSIONS_OF_ITEM) {
      return resolver(
        services.versions.getAllWantedVersionsOfItem(action.resource!),
      )
    }

    if (action.type === MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT) {
      return resolver(
        services.versions.getAllWantedVersionsByFormat(
          action.resource!,
          action.body as Optional<Version['format']>,
        ),
      )
    }

    if (action.type === MessageActions.GET_RELEASE_PAGE_ITEM_ID)
      return resolver(releasePage())

    if (action.type === MessageActions.GET_HIGHTLIGHTED_LABELS) {
      return resolver(services.highlightedLabels.get())
    }

    if (action.type === MessageActions.SET_HIGHTLIGHTED_LABELS) {
      return resolver(
        services.highlightedLabels.set(action.body as HightlightedLabels),
      )
    }

    if (action.type === MessageActions.WINDOW_RELOAD) window.location.reload()

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
