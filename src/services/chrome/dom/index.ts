import maybe from "maybe-for-sure";
import { ResourceUrl } from "../../../domain";
import { DiscogsActions } from "../../../redux/discogs";
import { uniqueRelease } from "./unique.releases";
import { uniqueSeller } from "./unique.sellers";

const domResolver = (type: DiscogsActions, url: ResourceUrl) => {
  if (type === (DiscogsActions.domFilterSellers as any)) {
    return Promise.resolve(uniqueSeller());
  }

  if (type === (DiscogsActions.domFilterReleases as any)) {
    return Promise.resolve(uniqueRelease());
  }

  if (type === (DiscogsActions.domGoTo as any)) {
    Promise.resolve(
      maybe(url)
        .map((it) => (window.location.href = it))
        .valueOr("Missing redirect url " + JSON.stringify(url))
    );
  }

  return Promise.resolve(undefined);
};

export default domResolver;
