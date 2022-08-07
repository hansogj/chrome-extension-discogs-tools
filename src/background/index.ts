import 'regenerator-runtime/runtime.js'
import { messageHandlerFactory } from '../services/message.handlers'
import { messageResolverFactory } from '../services/message.handlers/background.resolver'

chrome &&
  chrome.runtime &&
  chrome.runtime.onMessage.addListener(
    messageHandlerFactory(messageResolverFactory()),
  )
