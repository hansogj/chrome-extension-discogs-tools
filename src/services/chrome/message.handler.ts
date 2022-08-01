import { HightlightedLabels, Version } from '../../domain'
import { SelectedFields } from '../../domain/Inventory'
import { ActionTypes } from '../../redux'
import { DiscogsActions } from '../../redux/discogs'
import * as api from './api'
import domResolver from './dom'
import highlightedLabelsService from './highlighted.labels.service'
import { releasePage } from './release.page'
import fieldsService from './selectedFields.service'
import { MessageActions } from './types'
import versionsService from './versions.service'
import wantListService from './wantlist.service'

const services = {
  wantList: wantListService(),
  fields: fieldsService(),
  versions: versionsService(),
  highlightedLabels: highlightedLabelsService(),
}

const messagesFromReactAppListener = (
  action: ActionTypes,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: unknown) => void
) => {
  console.log('message received_ ', action)
  const resolver = (prom: Promise<unknown>) =>
    prom.then(sendResponse).catch((error) => sendResponse({ error }))
  messageResolver(action, resolver)
  return true
}

export const messageResolver = (
  action: ActionTypes,
  resolver: (prom: Promise<unknown>) => Promise<unknown>
) => {
  if (action.type === MessageActions.fetch)
    return resolver(api.fetch(action.resource!, action.body as SearchParams))

  if (action.type === MessageActions.post) {
    return resolver(
      api.post(action.resource!, action.body as SearchParams & PayLoad)
    )
  }

  if (action.type === MessageActions.put) {
    return resolver(
      api.put(action.resource!, action.body as SearchParams & PayLoad)
    )
  }

  if (action.type === MessageActions.deleteResource) {
    return resolver(api.deleteResource(action.resource!))
  }

  if (action.type === MessageActions.setUserToken)
    return resolver(api.setUserToken(action.body as string))

  if (action.type === MessageActions.DOM)
    return resolver(
      domResolver(action.body as DiscogsActions, action.resource!)
    )

  if (action.type === MessageActions.GET_WANT_LIST)
    return resolver(services.wantList.get(action.userId as number))
  if (action.type === MessageActions.SYNC_WANT_LIST)
    return resolver(
      services.wantList.sync(action.userId as number, action.body as string)
    )

  if (action.type === MessageActions.GET_SELECTED_FIELDS)
    return resolver(services.fields.get(action.userId as number))
  if (action.type === MessageActions.SET_SELECTED_FIELDS)
    return resolver(
      services.fields.set(
        action.userId as number,
        action.body as SelectedFields
      )
    )

  if (action.type === MessageActions.GET_ALL_WANTED_VERSIONS_OF_ITEM) {
    return resolver(
      services.versions.getAllWantedVersionsOfItem(action.resource!)
    )
  }

  if (action.type === MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT) {
    return resolver(
      services.versions.getAllWantedVersionsByFormat(
        action.resource!,
        action.body as Optional<Version['format']>
      )
    )
  }

  if (action.type === MessageActions.GET_RELEASE_PAGE_ITEM_ID)
    return resolver(releasePage())

  if (action.type === MessageActions.GET_HIGHTLIGHTED_LABELS) {
    return resolver(services.highlightedLabels.get())
  }

  if (action.type === MessageActions.SET_HIGHTLIGHTED_LABELS) {
    return resolver(
      services.highlightedLabels.set(action.body as HightlightedLabels)
    )
  }

  if (action.type === MessageActions.WINDOW_RELOAD) window.location.reload()
}

chrome &&
  chrome.runtime &&
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
