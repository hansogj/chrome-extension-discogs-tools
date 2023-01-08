import maybe, { Maybe } from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { Artist, Release } from '../../../domain';

import { DiscogsState } from '../discogs';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';

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
  (releasePageItem) =>
    maybe(releasePageItem).mapTo('master').valueOr(undefined) as Release.MasterReleaseDTO,
);

export const fromReleasePageMaster = (prop: keyof Release.MasterReleaseDTO) =>
  createSelector(getReleasePageMaster, (master) => maybe(master).mapTo(prop).valueOr(undefined));

export const getArtistId = createSelector(getDiscogsState, (discogs) =>
  maybe(discogs)
    .mapTo('artist')
    // @ts-ignore
    .mapTo('id')
    .valueOr(undefined),
);

export const getArtistName = createSelector(getDiscogsState, (discogs) =>
  (maybe(discogs).mapTo('artist') as Maybe<Artist>).mapTo('name').valueOr('Artist unknown'),
);
