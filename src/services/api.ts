import maybe from '@hansogj/maybe';
import { HighlightedLabels, Release, Paginated, ResourceUrl, Versions } from '../domain';
import { MessageActions } from './message.handlers';
import messageHandler from './message.handlers/popup.message.handler';
import { DiscogsActions } from './redux/discogs';
import { SyncStatus } from './redux/inventory';
import { Cache } from './wantlist.service';
import { AsyncData } from '@swan-io/boxed';

const sleep = <T>(timeout: number, v: () => Promise<T>) =>
  new Promise<T>((r) => setTimeout(() => r(v()), timeout));

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

export const syncCollection = async (userId: number, url: string) =>
  messageHandler<Cache>({
    type: MessageActions.SYNC_COLLECTION,
    body: url,
    userId,
  }).then((cache) => maybe(cache).valueOr({}) as Cache);

export const getSyncStatus = async () =>
  messageHandler<SyncStatus>({
    type: MessageActions.GET_SYNC_STATUS,
  }).then(
    ({ wantList, collection }): SyncStatus => ({
      wantList: wantList ? AsyncData.Loading() : AsyncData.NotAsked(),
      collection: collection ? AsyncData.Loading() : AsyncData.NotAsked(),
    }),
  );

export const getWindowLocation = async () =>
  messageHandler<URL>({
    type: MessageActions.GET_CURRENT_URL,
  }).then((url) => new URL(url));

export const fetchPaginated = async <T>(
  resource: ResourceUrl,
  page = 1,
  current: T[] = [],
  delay = 0,
): Promise<T[]> => {
  const { pagination, ...rest } = await sleep<Paginated<T>>(delay, () =>
    fetch(resource, {
      page,
      per_page: 100,
    }),
  );

  let next = [...current, rest] as T[];
  let newDelay = pagination.pages > 30 && page % 30 === 0 ? 10000 : 100;
  return pagination.page < pagination.pages
    ? fetchPaginated(resource, pagination.page + 1, next, newDelay)
    : next;
};

export const reload = async () =>
  messageHandler<Optional<Release.MasterReleaseDTO>>({
    type: MessageActions.WINDOW_RELOAD,
  });

export const getAllWantedVersionsByFormat = async (
  resource: string,
  format: Optional<Versions.DTO['format']>,
) =>
  messageHandler<Optional<Release.MasterReleaseDTO>>({
    type: MessageActions.GET_ALL_WANTED_VERSIONS_BY_FORMAT,
    resource,
    body: format,
  });

export const applyHighlightedLabels = async () =>
  messageHandler<HighlightedLabels>({
    type: MessageActions.APPLY_HIGHLIGHTED_LABELS,
  });
