import { Artist, ArtistRelease, Instance, ReleasePageItem } from '../../../domain';
import { DiscogsActions, DiscogsActionTypes } from './types';

export const getReleasePageItem = (): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItem,
});

export const releasePageItemLoaded = (releasePageItem: ReleasePageItem): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItemLoaded,
  releasePageItem,
});
export const artistReleasesLoaded = (
  artist: Artist,
  releases: ArtistRelease[],
): DiscogsActionTypes => ({
  type: DiscogsActions.getArtistReleasesLoaded,
  artistReleases: releases,
  artist,
});

export const addToFolderSuccess = (instance: Instance): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItem,
  instance,
});
