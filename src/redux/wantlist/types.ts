import { Version, WantList } from "../../domain";
import { ActionTypes } from "../types";

export interface WantListState {
  readonly wantList: WantList;
  readonly isSyncing: boolean;
  readonly addingToWantList: boolean;
}

export interface WantListActionData {
  wantList: Optional<WantList>;
  page: Optional<number>;
  format: Optional<Version["format"]>;
}

export enum WantListActions {
  getWantList = "GET_WANT_LIST",
  syncWantList = "SYNC_WANT_LIST",
  getWantListSuccess = "GET_WANT_LIST_SUCCESS",

  getWantListFailed = "GET_WANT_LIST_FAILED",
  addToWantList = "ADD_TO_WANT_LIST",
  addToWantListSuccess = "ADD_TO_WANT_LIST_SUCCESS",
}

export type WantListActionTypes = ActionTypes<
  WantListActions,
  WantListActionData
>;
