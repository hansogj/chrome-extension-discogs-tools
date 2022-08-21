import maybe from 'maybe-for-sure';
import { createSelector } from 'reselect';
import { User } from '../../../domain';
import { getUser } from './app.selectors';
import { getFolders, getSelectedFields } from './folders.selectors';

const fromUser = (prop: keyof User) =>
  createSelector(getUser, (user) => maybe(user).mapTo(prop).valueOr(undefined));

export const getFoldersResource = fromUser('collection_folders_url');
export const getFieldsResource = fromUser('collection_fields_url');
export const getInventoryResource = fromUser('inventory_url');
export const getWantListResource = fromUser('wantlist_url');
export const getFolderResource = fromUser('collection_folders_url');

export const getCollectionResource = createSelector(getFolders, (folders) =>
  maybe(folders)
    .map((it) => it.filter((folder) => folder.id === 0).shift())
    .map((it) => it?.resource_url + '/releases')
    .valueOr(undefined),
);

export const getAddReleaseToFolderResource = (release_id: number) => {
  return createSelector(getFolderResource, getSelectedFields, (folderResource, { folders }) =>
    [folderResource, folders, 'releases', release_id].join('/'),
  );
};

export type ResourceSelectors = typeof getFieldsResource | typeof getCollectionResource;
