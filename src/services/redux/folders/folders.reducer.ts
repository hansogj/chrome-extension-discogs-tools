import { reducerForProducers, writeToDraft } from '../utils';
import { FoldersActions, FoldersActionTypes, FoldersState } from './types';

export const initialState: FoldersState = {
  folders: [],
  fields: [],
  selectedFields: {},
  addingToFolder: false,
};

const wantlistReducer = reducerForProducers<FoldersState, FoldersActionTypes, FoldersActions>(
  initialState,
  {
    ADD_TO_FOLDER: (draft) => {
      draft.addingToFolder = true;
    },
    ADD_TO_FOLDER_SUCCESS: (draft) => {
      draft.addingToFolder = false;
    },
    GET_FOLDERS_SUCCESS: writeToDraft('folders'),
    GET_INVENTORY_FIELDS_SUCCESS: writeToDraft('fields'),
    SET_SELECTED_FIELDS_SUCCESS: writeToDraft('selectedFields'),
  },
);

export default wantlistReducer;
