import { isProduction } from '../../constants';
import domResolver from '../../content/dom';
import { Versions } from '../../domain';
import * as highlightedLabelsService from '../highlighted.labels.service';
import { ActionTypes } from '../redux';

import { DiscogsActions } from '../redux/discogs';
import * as versionsService from '../versions.service';
import * as xhr from '../xhr';
import getMockPage from '../__mock__/page.in.view';
import { MessageActionMatcher } from './MessageActionMatcher';
import { MessageActions, MessageActionTypes, MessageResolver } from './types';

export const messageResolverFactory = (): MessageResolver => (action: ActionTypes) =>
  new MessageActionMatcher(action, 'content')
    .matcher(MessageActions.DOM, (action: MessageActionTypes) =>
      domResolver(action.body as DiscogsActions, action.resource!),
    )
    .matcher(MessageActions.post, (action: MessageActionTypes) =>
      xhr.post(action.resource!, action.body as SearchParams & PayLoad),
    )
    .matcher(MessageActions.fetch, (action: MessageActionTypes) =>
      xhr.get(action.resource!, action.body as SearchParams),
    )
    .matcher(MessageActions.put, (action: MessageActionTypes) =>
      xhr.put(action.resource!, action.body as SearchParams & PayLoad),
    )
    .matcher(MessageActions.deleteResource, (action: MessageActionTypes) =>
      xhr.deleteResource(action.resource!),
    )
    .matcher(MessageActions.APPLY_HIGHLIGHTED_LABELS, () => highlightedLabelsService.apply())
    .matcher(MessageActions.GET_CURRENT_URL, () =>
      Promise.resolve(isProduction ? window.location.href : (getMockPage() as string)),
    )
    .matcher(MessageActions.WINDOW_RELOAD, () => window.location.reload() as any)
    .matcher(MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT, (action: MessageActionTypes) =>
      versionsService.getAllWantedVersionsByFormat(
        action.resource!,
        action.body as Optional<Versions.DTO['format']>,
      ),
    )
    .resolve();
