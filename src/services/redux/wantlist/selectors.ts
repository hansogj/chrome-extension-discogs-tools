import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';

import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';
import { WantListState } from '../wantlist';

export const getWantListState = (state: Partial<RootState>): WantListState =>
  selectFromRoot(state, 'WantList')!;

export const getWantList = createSelector(getWantListState, (discogs) =>
  maybe(discogs).mapTo('wantList').valueOr(undefined),
);

export const getCollection = createSelector(getWantListState, (discogs) =>
  maybe(discogs).mapTo('collection').valueOr(undefined),
);

export const isSyncing = createSelector(getWantListState, (discogs) =>
  maybe(discogs).mapTo('isSyncing').valueOr(false),
);

export const getInventory = createSelector(
  getWantList,
  getCollection,
  (wantlist = [], collection = []) => ({
    wantList: wantlist.length,
    collection: collection.length,
  }),
);
