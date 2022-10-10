import { Collection } from '../domain';
import { get as storageGet, set as storageSet, uniqueKey } from './storage';
import { StorageKeys } from './storage/types';
import { fetch } from './xhr';
type Cache = Collection.Release[];
const storageTarget = 'user-collection';
let isOngoingSyncing = false;

const getPaginatedCollection = async (url: string, page = 1, cache: Cache): Promise<Cache> => {
  isOngoingSyncing = true;
  return fetch(url, {
    page,
    per_page: 100,
  })
    .then(({ pagination, releases }: Collection.PaginatedCollection) => ({
      pagination,
      build: [
        ...cache,
        ...releases.map(({ basic_information: { title, master_id, thumb, year, artists } }) => ({
          thumb,
          title,
          master_id,
          year,
          artists: artists.map(({ id, name }) => ({ id, name })),
        })),
      ],
    }))
    .then(({ build, pagination }) =>
      pagination.page < pagination.pages
        ? getPaginatedCollection(url, pagination.page + 1, build)
        : build,
    );
};

const start = async (userId: number, url: string, page = 1) => {
  isOngoingSyncing = true;
  console.time();
  const userCollection = await getPaginatedCollection(url, page, []);
  console.timeEnd();
  await storageSet(uniqueKey(storageTarget, userId), userCollection);
  isOngoingSyncing = false;
};

export const sync = async (userId: number, url: string) => {
  setTimeout(() => start(userId, url, 1), 100);
  return true;
};

export const isSyncing = () => Promise.resolve(isOngoingSyncing);

const getFromStorage = (key: StorageKeys): Promise<Cache> => storageGet(key, []);

const getIndexed = (userId: number): Promise<Cache> =>
  getFromStorage(uniqueKey(storageTarget, userId));

export const get = (userId: number): Promise<Cache> =>
  getIndexed(userId).then((cache) => Object.values(cache));
