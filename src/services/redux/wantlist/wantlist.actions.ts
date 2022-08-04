import { Version, WantList } from '../../../domain'
import { WantListActions, WantListActionTypes } from './types'

export const getWantList = (page: number): WantListActionTypes => ({
  type: WantListActions.getWantList,
  page,
})

export const syncWantList = (): WantListActionTypes => ({
  type: WantListActions.syncWantList,
})

export const getWantListSuccess = (
  wantList: WantList,
): WantListActionTypes => ({
  type: WantListActions.getWantListSuccess,
  wantList,
})

export const addToWantList = (
  format?: Version['format'],
): WantListActionTypes => ({
  type: WantListActions.addToWantList,
  format,
})

export const addToWantListSuccess = (): WantListActionTypes => ({
  type: WantListActions.addToWantListSuccess,
})
