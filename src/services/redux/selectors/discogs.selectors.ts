import maybe, { Maybe } from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { Artist, Release } from '../../../domain';

import { DiscogsState } from '../discogs';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';
import { getCollection, getWantList } from './wantlist.selectors';

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

export const getWantedArtistReleases = createSelector(
  getArtistId,
  getWantList,
  (artistId, wantList) =>
    maybe(wantList)
      .map((it) => it.map(({ mainRelease }) => mainRelease!).filter(Boolean))

      .map((release) =>
        release
          .map((it) => ({
            ...it,
            artists: it.artists ? it.artists : [],
          }))
          .filter(({ artists }) => artists.map(({ id }) => id).includes(artistId!)),
      )
      .map((it) => it.sort((a, b) => (a.year < b.year ? -1 : 1)))
      .valueOr(undefined),
);

export const getCollectedArtistReleases = createSelector(
  getArtistId,
  getCollection,
  (artistId, collection) =>
    maybe(collection)
      .map((it) => it?.filter(({ artists }) => artists.map(({ id }) => id).includes(artistId!)))
      .map((it) => it.sort((a, b) => (a.year < b.year ? -1 : 1)))
      .valueOr(undefined),
);

export const getArtistName = createSelector(getDiscogsState, (discogs) =>
  (maybe(discogs).mapTo('artist') as Maybe<Artist>).mapTo('name').valueOr('Artist unknown'),
);
