import { Folder, InventoryFields, SelectedFields } from '../../../domain';
import { setView } from '../app/app.actions';
import { FoldersActions, FoldersActionTypes } from './types';

export const getFolders = (): FoldersActionTypes => ({
  type: FoldersActions.getFolders,
});

export const getFoldersSuccess = (folders: Array<Folder>): FoldersActionTypes => ({
  type: FoldersActions.getFoldersSuccess,
  folders,
});

export const getInventoryFieldsSuccess = (fields: InventoryFields) => ({
  type: FoldersActions.getInventoryFieldsSuccess,
  fields,
});

export const setSelectedFields = (selectedFields: SelectedFields): FoldersActionTypes => ({
  type: FoldersActions.setSelectedFields,
  selectedFields,
});

export const setSelectedFieldsSuccess = (selectedFields: SelectedFields): FoldersActionTypes => ({
  type: FoldersActions.setSelectedFieldsSuccess,
  selectedFields,
});

export const addToFolder = (): FoldersActionTypes => ({
  type: FoldersActions.addToFolder,
});

export const addToFolderSuccess = (): FoldersActionTypes => ({
  type: FoldersActions.addToFolderSuccess,
});
