import 'regenerator-runtime/runtime.js'
import { messageHandlerFactory } from '../services/message.handlers'
import { messageResolverFactory } from '../services/message.handlers/content.resolver'
import highlightedLabelsService from '../services/highlighted.labels.service'
import fieldsService from '../services/selectedFields.service'
import versionsService from '../services/versions.service'
import wantListService from '../services/wantlist.service'

console.log('loading content index')

chrome &&
  chrome.runtime &&
  chrome.runtime.onMessage.addListener(
    messageHandlerFactory(
      messageResolverFactory({
        wantList: wantListService(),
        fields: fieldsService(),
        versions: versionsService(),
        highlightedLabels: highlightedLabelsService(),
      }),
    ),
  )
