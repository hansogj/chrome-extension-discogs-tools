import { createSelector } from 'reselect';
import maybe from '@hansogj/maybe';
import { WantList } from '../../../domain';
import { fromUser } from '../app/selectors';
import { getArtistId } from '../discogs/selectors';
import { getSelectedFields } from '../folders/selectors';
import { getCollection, getWantList } from '../wantlist/selectors';

export const getFoldersResource = fromUser('collection_folders_url');
export const getFieldsResource = fromUser('collection_fields_url');
export const getInventoryResource = fromUser('inventory_url');
export const getWantListResource = fromUser('wantlist_url');
export const getAddReleaseToFolderResource = (release_id: number) =>
  createSelector(getFoldersResource, getSelectedFields, (folderResource, { folders }) =>
    [folderResource, folders, 'releases', release_id].join('/'),
  );

export const getAllFoldersReleasesResource = createSelector(getFoldersResource, (folderResource) =>
  [folderResource, 0, 'releases'].join('/'),
);

export type ResourceSelectors = typeof getFieldsResource;

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
