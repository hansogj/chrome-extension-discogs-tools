import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';

import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';
import { InventoryState } from '../inventory';
import { RootState } from '../root.reducers';
import { initialSyncStatus } from './inventory.reducer';

export const getInventoryState = (state: Partial<RootState>): InventoryState =>
  selectFromRoot(state, 'Inventory')!;

export const getWantList = createSelector(getInventoryState, (discogs) =>
  maybe(discogs).mapTo('wantList').valueOr(undefined),
);

export const getCollection = createSelector(getInventoryState, (discogs) =>
  maybe(discogs).mapTo('collection').valueOr(undefined),
);

export const getSyncStatus = createSelector(getInventoryState, (discogs) =>
  maybe(discogs).mapTo('syncStatus').valueOr(initialSyncStatus()),
);

export const getInventory = createSelector(
  getWantList,
  getCollection,
  (wantList = [], collection = []) => ({
    wantList: wantList.length,
    collection: collection.length,
  }),
);
