import maybe from 'maybe-for-sure';
import { createSelector } from 'reselect';
import { WantList } from '../../../domain';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';
import { WantListState } from '../wantlist';

export const getWantListState = (state: Partial<RootState>): WantListState =>
  selectFromRoot(state, 'WantList')!;

export const getWantList = createSelector(getWantListState, (discogs) =>
  maybe(discogs)
    .mapTo('wantList')
    .valueOr({} as WantList),
);

export const isSyncing = createSelector(getWantListState, (discogs) =>
  maybe(discogs).mapTo('isSyncing').valueOr(false),
);
