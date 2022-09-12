import { Artist, Instance, ReleasePageItem } from '../../../domain';
import { ArtistReleases } from '../../../domain';
import { DiscogsActions, DiscogsActionTypes } from './types';

export const getReleasePageItem = (): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItem,
});

export const getReleasePageItemLoaded = (releasePageItem: ReleasePageItem): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItemLoaded,
  releasePageItem,
});
export const getArtistReleasesLoaded = (
  artist: Artist,
  releases: ArtistReleases,
): DiscogsActionTypes => ({
  type: DiscogsActions.getArtistReleasesLoaded,
  artistReleases: releases,
  artist,
});

export const addToFolderSuccess = (instance: Instance): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItem,
  instance,
});
