import 'regenerator-runtime/runtime.js';
import { messageHandlerFactory } from '../services/message.handlers';
import { messageResolverFactory } from '../services/message.handlers/background.resolver';

if (chrome?.runtime?.onMessage?.addListener) {
  console.log('loading background index');
  chrome?.runtime?.onMessage?.addListener(messageHandlerFactory(messageResolverFactory()));
} else {
  console.log('no addListener found on background runtime service');
}
