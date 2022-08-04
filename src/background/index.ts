import 'regenerator-runtime/runtime.js'
import { messageHandlerFactory } from '../services/message.handlers'
import { messageResolverFactory } from '../services/message.handlers/background.resolver'

console.log('loading background index')

chrome &&
  chrome.runtime &&
  chrome.runtime.onMessage.addListener(
    messageHandlerFactory(messageResolverFactory()),
  )
