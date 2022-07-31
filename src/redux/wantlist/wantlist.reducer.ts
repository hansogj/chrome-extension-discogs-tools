import { reducerForProducers } from "../utils";
import { WantListActions, WantListActionTypes, WantListState } from "./types";

export const initialState: WantListState = {
  wantList: [],
  isSyncing: false,
  addingToWantList: false,
};

const wantListReducer = reducerForProducers<
  WantListState,
  WantListActionTypes,
  WantListActions
>(initialState, {
  SYNC_WANT_LIST: (draft) => {
    draft.isSyncing = true;
  },
  GET_WANT_LIST_SUCCESS: (draft, action) => {
    draft.isSyncing = false;
    draft.wantList = action.wantList!;
  },
  ADD_TO_WANT_LIST: (draft) => {
    draft.addingToWantList = true;
  },
  ADD_TO_WANT_LIST_SUCCESS: (draft) => {
    draft.addingToWantList = false;
  },
});

export default wantListReducer;
