import { Folder, InventoryFields } from "../../domain";
import { ActionTypes } from "../types";

export interface FoldersState {
  readonly folders: Array<Folder>;
  readonly fields: InventoryFields;
  readonly selectedFields: Record<string, string>;
  readonly addingToFolder: boolean;
}

export interface FoldersActionData {
  folders: Optional<Array<Folder>>;
  fields: Optional<InventoryFields>;
  selectedFields: Optional<Record<string, string>>;
  addingToFolder: false;
}

export enum FoldersActions {
  getFolders = "GET_FOLDERS",
  getFoldersSuccess = "GET_FOLDERS_SUCCESS",
  getFoldersFailed = "GET_FOLDERS_FAILED",

  addToFolder = "ADD_TO_FOLDER",
  addToFolderSuccess = "ADD_TO_FOLDER_SUCCESS",
  getInventoryFieldsSuccess = "GET_INVENTORY_FIELDS_SUCCESS",

  setSelectedFields = "SET_SELECTED_FIELDS",
  setSelectedFieldsSuccess = "SET_SELECTED_FIELDS_SUCCESS",
}

export type FoldersActionTypes = ActionTypes<FoldersActions, FoldersActionData>;
