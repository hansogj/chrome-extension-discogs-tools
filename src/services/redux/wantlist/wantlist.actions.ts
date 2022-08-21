import { WantList } from '../../../domain';
import { WantListActions, WantListActionTypes } from './types';

export const getWantList = (): WantListActionTypes => ({
  type: WantListActions.getWantList,
});

export const syncWantList = (): WantListActionTypes => ({
  type: WantListActions.syncWantList,
});

export const syncWantListEnded = (): WantListActionTypes => ({
  type: WantListActions.syncWantlistEnded,
});

export const getWantListSuccess = (wantList: WantList): WantListActionTypes => ({
  type: WantListActions.getWantListSuccess,
  wantList,
});
