import { Artist, ArtistRelease, Instance, ReleasePageItem } from '../../../domain';
import { ActionTypes } from '../types';

export interface DiscogsState {
  readonly releasePageItem: Optional<ReleasePageItem>;
  readonly artistReleases: Optional<ArtistRelease[]>;
  readonly artist: Optional<Artist>;
}

export interface DiscogsActionData {
  instance: Optional<Instance>;
  releasePageItem: Optional<ReleasePageItem>;
  artistReleases: Optional<ArtistRelease[]>;
  artist: Optional<Artist>;
}

export enum DiscogsActions {
  getReleasePageItem = 'GET_RELEASE_PAGE_ITEM',
  getReleasePageItemLoaded = 'GET_RELEASE_PAGE_ITEM_LOADED',
  getArtistReleasesLoaded = 'GET_ARTIST_RELEASES_LOADED',
  domGoTo = 'DOM_GO_TO',
  domFilterSellers = 'DOM_FILTER_SELLERS',
  domFilterReleases = 'DOM_FILTER_RELEASES',
}

export type DiscogsActionTypes = ActionTypes<DiscogsActions, DiscogsActionData>;
