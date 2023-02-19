import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { WantList } from '../../../domain';
import { getArtistId, getReleasePageId } from '../discogs/selectors';
import { getSelectedFields } from '../folders/selectors';
import { getFoldersResource } from '../user/selectors';
import { getCollection, getWantList } from '../inventory/selectors';
import { removeRedundantSlashes } from '../../utils/strings';

export const combinedGetAddReleaseToFolderResource = createSelector(
  getReleasePageId,
  getFoldersResource,
  getSelectedFields,
  (release_id, folderResource, { folders }) =>
    removeRedundantSlashes(
      [folderResource, folders, 'releases', release_id].filter(Boolean).join('/'),
    ),
);

export const getAllFoldersReleasesResource = createSelector(getFoldersResource, (folderResource) =>
  removeRedundantSlashes([folderResource, 0, 'releases'].join('/')),
);

const sortByYear = (it: any) => it.sort((a: any, b: any) => (a.year < b.year ? -1 : 1));

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
      .map(sortByYear)
      .valueOr(undefined),
);

export const getCollectedArtistReleases = createSelector(
  getArtistId,
  getCollection,
  (artistId, collection) =>
    maybe(collection)
      .map((it) => it?.filter(({ artists }) => artists.map(({ id }) => id).includes(artistId!)))
      .map(sortByYear)
      .valueOr(undefined),
);
