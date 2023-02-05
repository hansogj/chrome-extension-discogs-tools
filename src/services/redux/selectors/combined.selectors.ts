import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { WantList } from '../../../domain';
import { getArtistId, getReleasePageId } from '../discogs/selectors';
import { getSelectedFields } from '../folders/selectors';
import { getFoldersResource } from '../user/selectors';
import { getCollection, getWantList } from '../wantlist/selectors';

export const combinedGetAddReleaseToFolderResource = createSelector(
  getReleasePageId,
  getFoldersResource,
  getSelectedFields,
  (release_id, folderResource, { folders }) =>
    [folderResource, folders, 'releases', release_id].join('/'),
);

export const getAllFoldersReleasesResource = createSelector(getFoldersResource, (folderResource) =>
  [folderResource, 0, 'releases'].join('/'),
);

export const getWantedArtistReleases = createSelector(
  getArtistId,
  getWantList,
  (artistId, wantList) =>
    maybe(wantList)
      .map((it: WantList.Item[]) => it.map(({ mainRelease }) => mainRelease!).filter(Boolean))

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
