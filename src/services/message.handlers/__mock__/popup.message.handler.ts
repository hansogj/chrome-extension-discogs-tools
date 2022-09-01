import { ActionTypes } from '../../redux';
import { messageResolverFactory as backgroundMessageResolver } from '.././background.resolver';
import { messageResolverFactory as contentMessageResolver } from '.././content.resolver';

export const messageHandlerFallback = (action: ActionTypes) =>
  Promise.race([contentMessageResolver()(action), backgroundMessageResolver()(action)]);
