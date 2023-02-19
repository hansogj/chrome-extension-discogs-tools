import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';

import { RootState } from '../root.reducers';
import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';
import { InventoryState } from '../inventory';

export const getInventoryState = (state: Partial<RootState>): InventoryState =>
  selectFromRoot(state, 'Inventory')!;

export const getWantList = createSelector(getInventoryState, (discogs) =>
  maybe(discogs).mapTo('wantList').valueOr(undefined),
);

export const getCollection = createSelector(getInventoryState, (discogs) =>
  maybe(discogs).mapTo('collection').valueOr(undefined),
);

export const isSyncing = createSelector(getInventoryState, (discogs) =>
  maybe(discogs).mapTo('isSyncing').valueOr(false),
);

export const getInventory = createSelector(
  getWantList,
  getCollection,
  (wantList = [], collection = []) => ({
    wantList: wantList.length,
    collection: collection.length,
  }),
);
