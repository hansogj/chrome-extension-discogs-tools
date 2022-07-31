import maybe from "maybe-for-sure";
import { PaginatedWantList, Want } from "../../domain";
import { fetch } from "./api";
import { get, set, uniqueKey } from "./local.storage";

export type Cache = Record<string, Object>;

const toWantList = (wants: Want[]) =>
  wants
    .map(({ basic_information, date_added }) => ({
      ...basic_information,
      date_added,
    }))
    .map(
      ({
        id,
        master_id,
        date_added,
        artists,
        formats,
        thumb,
        cover_image,
        title,
        year,
      }) => ({
        wantListId: maybe(master_id)
          .map((it) => `master/${it}`)
          .valueOr(`release/${id}`),
        artists,
        thumb,
        title,
        year,
        cover_image,
        date_added,
        formats: formats.filter((_, i) => i === 0),
      })
    );

const wantListService = () => {
  const getCachedValues = (userId: number): Cache =>
    get(uniqueKey("want-list", userId), {});

  const call = async (url: string, page = 1, cache: Cache): Promise<Cache> => {
    const { pagination, wants }: PaginatedWantList = await fetch(url, {
      page,
      per_page: 100,
    });

    const build: Cache = toWantList(wants)
      .filter(({ wantListId }) => !!wantListId && !cache[wantListId])
      .reduce((curr, { wantListId, ...rest }) => {
        try {
          curr[wantListId] = rest;
        } catch (error) {
          debugger;
        }
        return curr;
      }, cache);

    return pagination.page < pagination.pages
      ? call(url, pagination.page + 1, build)
      : build;
  };

  const sync = async (userId: number, url: string, page = 1) => {
    console.log(userId, url, page);
    console.time();
    const res = await call(url, page, {});
    console.timeEnd();
    set(uniqueKey(`want-list`, userId), res);
    return Promise.resolve(res);
  };

  return {
    get: (userId: number) => Promise.resolve(getCachedValues(userId)),
    sync,
  };
};

export default wantListService;
