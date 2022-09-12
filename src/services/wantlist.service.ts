import maybe from '@hansogj/maybe';
import { BasicInformation, MasterRelease, PaginatedWantList, Want, WantListItem } from '../domain';
import { get as storageGet, set as storageSet, uniqueKey } from './storage';
import { fetch } from './xhr';

export type Cache = Record<string, WantListItem>;

const wantlistProperties = ({
  id,
  master_id,
  master_url,
  date_added,
  artists,
  thumb,
  cover_image,
  title,
  year,
}: BasicInformation & { date_added: any }) => ({
  wantListId: maybe(master_id)
    .map((it) => `master/${it}`)
    .valueOr(`release/${id}`),
  artists,
  master_url,
  thumb,
  title,
  year,
  cover_image,
  date_added,
});

export const toWantList = (wants: Want[]): WantListItem[] =>
  wants
    .map(({ basic_information, date_added }) => ({
      ...basic_information,
      date_added,
    }))
    .map(wantlistProperties);

const sleep = <T>(timeout: number, v: () => Promise<T>) =>
  new Promise<T>((r) => setTimeout(() => r(v()), timeout));

const fetchMainReleaseAndUpdateCache = async (master_url: string, delay: number) => {
  let mainRelease = await sleep<MasterRelease>(delay, () => fetch(master_url)).then(
    ({ main_release_url }: MasterRelease) => fetch(main_release_url),
  );
  return mainRelease;
};

const updateWithMaster = (userId: number) =>
  get(userId).then((cache) =>
    Promise.all(
      Object.entries(cache)
        .filter(([_, val]: [string, WantListItem]) => Boolean(val.master_url))
        .map(async ([key, { master_url, date_added }]: [string, WantListItem], i: number) => {
          const mainRelease = await fetchMainReleaseAndUpdateCache(master_url, i * 2500);
          let freshCache = await get(userId);
          const asWantList = wantlistProperties({
            ...mainRelease,
            date_added,
          } as any);
          return storageSet(uniqueKey(`want-list`, userId), {
            ...freshCache,
            [key]: asWantList,
          });
        }),
    ),
  );

const call = async (url: string, page = 1, cache: Cache): Promise<Cache> => {
  const { pagination, wants }: PaginatedWantList = await fetch(url, {
    page,
    per_page: 100,
  });

  const build: Cache = toWantList(wants)
    .filter(({ wantListId }) => !!wantListId && !cache[wantListId])
    .reduce((curr, { wantListId, ...rest }) => {
      try {
        // @ts-ignore
        curr[wantListId] = rest;
      } catch (error) {
        throw error;
      }
      return curr;
    }, cache);

  return pagination.page < pagination.pages ? call(url, pagination.page + 1, build) : build;
};
let isOngoingSyncing = false;
const start = async (userId: number, url: string, page = 1) => {
  isOngoingSyncing = true;
  console.time();
  const wantList = await call(url, page, {});
  console.timeEnd();
  storageSet(uniqueKey(`want-list`, userId), wantList);
  updateWithMaster(userId).then(() => (isOngoingSyncing = false));
};

export const sync = async (userId: number, url: string) => {
  setTimeout(() => start(userId, url, 1), 100);
  return true;
};

export const isSyncing = () => Promise.resolve(isOngoingSyncing);

export const get = (userId: number): Promise<Cache> =>
  storageGet(uniqueKey('want-list', userId), {});
