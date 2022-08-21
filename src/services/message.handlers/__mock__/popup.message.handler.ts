import { ActionTypes } from '../../redux';
import { messageResolverFactory as backgroundMessageResolver } from '.././background.resolver';
import { messageResolverFactory as contentMessageResolver } from '.././content.resolver';
import { MessageActionMatcher } from '../MessageActionMatcher';

export const messageHandlerFallback = (action: ActionTypes) =>
  Promise.race([
    contentMessageResolver()(new MessageActionMatcher(action, 'content')),
    backgroundMessageResolver()(new MessageActionMatcher(action, 'background')),
  ]);
