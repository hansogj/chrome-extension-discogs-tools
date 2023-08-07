import 'regenerator-runtime/runtime.js';
import { apply as applyHighlightedLabels } from '../services/highlighted.labels.service';
import { messageHandlerFactory } from '../services/message.handlers';
import { messageResolverFactory } from '../services/message.handlers/content.resolver';

if (chrome?.runtime?.onMessage?.addListener) {
  console.log('loading content index');
  chrome?.runtime?.onMessage?.addListener(messageHandlerFactory(messageResolverFactory()));
  // applyHighlightedLabels();
  console.log('TODO');
} else {
  console.log('no addListener found on content runtime service');
}
