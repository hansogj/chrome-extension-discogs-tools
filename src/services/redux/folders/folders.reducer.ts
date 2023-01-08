import { reducerForProducers, writeToDraft } from '../../../gist/immer-utils/immer.utils';
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
    [FoldersActions.addToFolder]: (draft) => {
      draft.addingToFolder = true;
    },
    [FoldersActions.addToFolderSuccess]: (draft) => {
      draft.addingToFolder = false;
    },
    [FoldersActions.getFoldersSuccess]: writeToDraft('folders'),
    [FoldersActions.getInventoryFieldsSuccess]: writeToDraft('fields'),
    [FoldersActions.setSelectedFieldsSuccess]: writeToDraft('selectedFields'),
  },
);

export default wantlistReducer;
