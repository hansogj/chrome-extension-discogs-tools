import maybe from '@hansogj/maybe';
import { AsyncData } from '@swan-io/boxed';
import { BasicInformation, Release, WantList } from '../domain';
import { Async, asyncOk } from './redux/domain';
import { get as storageGet, set as storageSet, uniqueKey } from './storage';
import { StorageKeys } from './storage/types';
import { get as xhrGet } from './xhr';

export type Cache = Record<string, WantList.Item>;
const storageTarget = 'want-list';
let asyncStatus: Async.Type<string> = AsyncData.NotAsked();

const fetchMainRelease = async (basics: WantList.Basics): Promise<Release.DTO> => {
  const { master_url, resource_url } = basics;

  if (master_url) {
    return xhrGet(master_url).then(
      ({ main_release_url }: Release.MasterReleaseDTO) =>
        xhrGet(main_release_url) as Promise<Release.DTO>,
    );
  }
  if (resource_url) {
    return xhrGet(resource_url) as Promise<Release.DTO>;
  }

  return Promise.reject(
    new Error(`no resource url to be found on basics: ${JSON.stringify(basics)}`),
  );
};

const getEntryWithMainRelease = async ({ basics, date_added }: WantList.Item) => {
  asyncStatus = AsyncData.Loading();

  return fetchMainRelease(basics).then(
    ({ master_url, artists, thumb, title, year, master_id }) => ({
      basics,
      date_added,
      mainRelease: {
        master_url,
        master_id,
        thumb,
        title,
        year,
        artists: artists.map(({ id, name }) => ({ id, name })),
      },
    }),
  );
};

const recoverFromExceededRateLimit = (
  e: any,
  update: Cache,
  index: number,
  storageKey: StorageKeys,
): Promise<Cache> => {
  const awaitWhileRecovering = e.rateLimit ? new Date(e.rateLimit).getMilliseconds() : 60000;
  asyncStatus = AsyncData.NotAsked();
  return new Promise((resolve) =>
    setTimeout(() => {
      asyncStatus = AsyncData.Loading();
      resolve(updateWithMainRelease(update, index, storageKey));
    }, awaitWhileRecovering),
  );
};

const updateWithMainRelease = async (
  update: Cache,
  index: number,
  storageKey: StorageKeys,
): Promise<Cache> =>
  getFromStorage(storageKey).then((cache) => {
    const entries = Object.entries(update);

    if (entries.length && index < entries.length) {
      const [key, item] = entries[index];
      return item?.mainRelease
        ? updateWithMainRelease(update, index + 1, storageKey)
        : getEntryWithMainRelease(item)
            .then((entryWithMainRelease) => ({
              ...cache,
              [key]: entryWithMainRelease,
            }))
            .then((updatedEntry) => storageSet(storageKey, updatedEntry))
            .then(() => updateWithMainRelease(update, index + 1, storageKey))
            .catch((e) => recoverFromExceededRateLimit(e, update, index, storageKey));
    }

    return Promise.resolve(cache);
  });

const getWantListId = (item: BasicInformation) => maybe(item).mapTo('master_id').valueOr(item.id);

const getPaginatedWantlist = async (url: string, page = 1, prev: Cache): Promise<Cache> => {
  const { pagination, wants }: WantList.PaginatedWantList = await xhrGet(url, {
    page,
    per_page: 100,
  });

  const next: Cache = wants
    .map(({ basic_information, date_added }) => ({
      basic_information,
      date_added,
      wantListId: getWantListId(basic_information),
    }))
    .filter(({ wantListId }, _, self) =>
      [prev, self].every((struct: Record<string, any>) => !struct[wantListId]),
    )
    .reduce((curr, { date_added, wantListId, basic_information }) => {
      const { id, master_id, master_url, resource_url } = basic_information;
      try {
        curr[wantListId] = { date_added, basics: { id, master_id, master_url, resource_url } };
      } catch (error) {
        throw error;
      }
      return curr;
    }, prev);

  return pagination.page < pagination.pages
    ? getPaginatedWantlist(url, pagination.page + 1, next)
    : next;
};

const start = async (userId: number, url: string, page = 1) => {
  console.clear();
  console.time();

  const currentCache = await getIndexed(userId);
  const freshWantlist = await getPaginatedWantlist(url, page, {});

  const currentCacheStrippedFromRemoved = pick(currentCache, freshWantlist);
  const newToWantlist = omit(freshWantlist, currentCacheStrippedFromRemoved);

  await storageSet(uniqueKey(storageTarget, userId), currentCacheStrippedFromRemoved);
  await updateWithMainRelease(newToWantlist, 0, uniqueKey(storageTarget, userId));
  console.timeEnd();
  asyncStatus = asyncOk('Wantlist: syncing done');
};

export const sync = async (userId: number, url: string) => {
  asyncStatus = AsyncData.Loading();
  setTimeout(() => start(userId, url, 1), 100);
  return true;
};

export const isSyncing = () => Promise.resolve(asyncStatus.isLoading());

const getFromStorage = (key: StorageKeys): Promise<Cache> => storageGet(key, {});

const getIndexed = (userId: number): Promise<Cache> =>
  getFromStorage(uniqueKey(storageTarget, userId));

export const get = (userId: number): Promise<WantList.Item[]> =>
  getIndexed(userId).then((cache) => Object.values(cache));

export const pick = (
  a: Cache,
  b: Cache,
  filter = ([key]: [string, ...any]) => Object.keys(b).includes(key),
): Cache =>
  Object.entries(a)
    .filter(filter)
    .reduce(
      (curr, [key, val]) => ({
        ...curr,
        [key]: val,
      }),
      {} as Cache,
    );

export const omit = (a: Cache, b: Cache): Cache =>
  pick(a, b, ([key, _]) => !Object.keys(b).includes(key));
