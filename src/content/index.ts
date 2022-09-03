import 'regenerator-runtime/runtime.js';
import { apply as applyHighlightedLabels } from '../services/highlighted.labels.service';
import { messageHandlerFactory } from '../services/message.handlers';
import { messageResolverFactory } from '../services/message.handlers/content.resolver';
console.log('loading content index');

applyHighlightedLabels();

chrome &&
  chrome.runtime &&
  chrome.runtime.onMessage.addListener(messageHandlerFactory(messageResolverFactory()));
