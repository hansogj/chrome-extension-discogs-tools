import maybe, { Maybe } from '@hansogj/maybe';
import { createSelector } from 'reselect';
import {
  Artist,
  ArtistRelease,
  BasicInformation,
  MasterRelease,
  Want,
  WantList,
} from '../../../domain';
import { toWantList } from '../../wantlist.service';
import { DiscogsState } from '../discogs';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';
import { getWantList } from './wantlist.selectors';

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

export const getArtistReleases = createSelector(getDiscogsState, (discogs) =>
  maybe(discogs).mapTo('artistReleases').valueOr(undefined),
);

const inCollection = (release: ArtistRelease) => Boolean(release.stats.user.in_collection);
const inWantList = (release: ArtistRelease) => Boolean(release.stats.user.in_wantlist);

export const getWantedArtistReleases = createSelector(
  getArtistReleases,
  getWantList,
  (releases, wantList) =>
    maybe(releases)
      .map((it) =>
        it
          .filter(inWantList)
          .map(({ type, id, main_release }) => (type === 'master' ? id : main_release))
          .map((id) => wantList[`master/${id}` as any])
          .filter(Boolean)
          .reduce(
            (curr, { wantListId }) => ({
              ...curr,
              [wantListId]: wantList[wantListId as any],
            }),
            {} as WantList,
          ),
      )
      .valueOr({}) as WantList,
);

export const getCollectedArtistReleases = createSelector(
  getArtistReleases,
  (releases: Optional<ArtistRelease[]>) =>
    maybe(releases)
      .map((it) =>
        it.filter(inCollection).map(({ title, id, artist: name, year, thumb }) => ({
          basic_information: {
            id,
            title,
            artists: [{ name }] as Artist[],
            year,
            thumb,
            master_url: '',
            cover_image: thumb,
          } as BasicInformation,

          date_added: new Date(),
        })),
      )
      .map((wants: Partial<Want>[]) =>
        toWantList(wants as Want[]).reduce(
          (curr, { wantListId, ...rest }) => ({
            ...curr,
            [wantListId]: rest,
          }),
          {} as WantList,
        ),
      )
      .valueOr({}),
);

export const getArtistName = createSelector(getDiscogsState, (discogs) =>
  (maybe(discogs).mapTo('artist') as Maybe<Artist>).mapTo('name').valueOr('Artist unknown'),
);

export const hasArtistReleases = createSelector(getArtistReleases, Boolean);
export const hasReleasePageItem = createSelector(getReleasePageItem, Boolean);
