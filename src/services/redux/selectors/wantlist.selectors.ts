import maybe from "maybe-for-sure";
import { createSelector } from "reselect";
import { RootState } from "../root.reducers";
import { selectFromRoot } from "../utils";
import { WantListState } from "../wantlist";

export const getWantListState = (state: Partial<RootState>): WantListState =>
  selectFromRoot(state, "WantList")!;

export const getWantList = createSelector(getWantListState, (discogs) =>
  maybe(discogs)
    .mapTo("wantList")
    .valueOr({} as WantListState["wantList"])
);

export const isSyncing = createSelector(getWantListState, (discogs) =>
  maybe(discogs).mapTo("isSyncing").valueOr(false)
);
