import maybe from "maybe-for-sure";
import { Release, ReleasePageItem } from "../../domain";
import { DISCOGS_BASE_URL } from "../../redux/app";
import * as api from "./api";

export const releasePage = (
  url = window.location.href
): Promise<ReleasePageItem> => {
  const getItemUri = (reg: RegExp) =>
    maybe(url.split(reg))
      .map((it) => it.pop())
      .nothingIf((it) => it === undefined)
      .map((it) => `${it}`.split("-").shift())
      .map((it) => parseInt(it!, 10))
      .nothingIf(isNaN)
      .valueOr(undefined);

  const [releaseId, masterId] = [/\/release\//, /\/master\//].map(getItemUri);

  const itemUri = maybe(releaseId)
    .map((it) => `/releases/${it}`)
    .or(maybe(masterId).map((it) => `/masters/${it}`))
    .valueOr(undefined);

  return itemUri
    ? api
        .fetch(`${DISCOGS_BASE_URL}/${itemUri}`)
        .then(({ master_url, ...rest }: Release) =>
          master_url ? api.fetch(master_url) : rest
        )
        .then((master: Release) => ({ master, releaseId } as any))
    : Promise.reject("cannot find a release on this page");
};
