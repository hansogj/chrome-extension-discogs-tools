import maybe from 'maybe-for-sure';
import { createSelector } from 'reselect';
import { MasterRelease } from '../../../domain';
import { DiscogsState } from '../discogs';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';

export const getDiscogsState = (state: Partial<RootState>): DiscogsState =>
  selectFromRoot(state, 'Discogs')!;

export const getReleasePageItem = createSelector(getDiscogsState, (discogs) =>
  maybe(discogs).mapTo('releasePageItem').valueOr(undefined),
);

export const getReleasePageId = createSelector(getReleasePageItem, (releasePageItem) =>
  maybe(releasePageItem).mapTo('releaseId').valueOr(undefined),
);

export const getReleasePageMaster = createSelector(
  getReleasePageItem,
  (releasePageItem) => maybe(releasePageItem).mapTo('master').valueOr(undefined) as MasterRelease,
);

export const fromReleasePageMaster = (prop: keyof MasterRelease) =>
  createSelector(getReleasePageMaster, (master) => maybe(master).mapTo(prop).valueOr(undefined));
