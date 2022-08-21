import maybe from 'maybe-for-sure';
import { HighlightedLabels, MasterRelease, ResourceUrl, Version } from '../domain';
import { MessageActions } from './message.handlers';
import messageHandler from './message.handlers/popup.message.handler';
import { DiscogsActions } from './redux/discogs';
import { Cache } from './wantlist.service';

export const fetch = async <T>(resource: ResourceUrl, body?: SearchParams) =>
  messageHandler<T>({ type: MessageActions.fetch, resource, body });

export const put = async <T>(resource: ResourceUrl, body?: SearchParams & PayLoad) =>
  messageHandler<T>({ type: MessageActions.put, resource, body });

export const post = async <T>(resource: ResourceUrl, body?: SearchParams & PayLoad) =>
  messageHandler<T>({ type: MessageActions.post, resource, body });

export const deleteResource = async <T>(resource: ResourceUrl) =>
  messageHandler<T>({ type: MessageActions.deleteResource, resource });

export const manipulateDom = async (body: DiscogsActions, resource: ResourceUrl) =>
  messageHandler({ type: MessageActions.DOM, body: body, resource }).catch(
    () => new Error('not able to do dom-manipulation in this view: ' + JSON.stringify(body)),
  );

export const syncWantList = async (userId: number, url: string) =>
  messageHandler<Cache>({
    type: MessageActions.SYNC_WANT_LIST,
    body: url,
    userId,
  }).then((cache) => maybe(cache).valueOr({}) as Cache);

export const wantlistIsSyncing = async () =>
  messageHandler<boolean>({
    type: MessageActions.WANT_LIST_IS_SYNCING,
  });

export const getReleasePageItem = async () =>
  messageHandler<Optional<MasterRelease>>({
    type: MessageActions.GET_CURRENT_URL,
  }).then((body) =>
    messageHandler<Optional<MasterRelease>>({
      type: MessageActions.GET_RELEASE_PAGE_ITEM_ID,
      body,
    }),
  );

export const reload = async () =>
  messageHandler<Optional<MasterRelease>>({
    type: MessageActions.WINDOW_RELOAD,
  });

export const getAllWantedVersionsByFormat = async (
  resource: string,
  format: Optional<Version['format']>,
) =>
  messageHandler<Optional<MasterRelease>>({
    type: MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT,
    resource,
    body: format,
  });

export const applyHighglightedLabels = async () =>
  messageHandler<HighlightedLabels>({
    type: MessageActions.APPLY_HIGHLIGHTED_LABELS,
  });
