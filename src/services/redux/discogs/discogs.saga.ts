import '@hansogj/array.utils'
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects'
import { ReleasePageItem } from '../../../domain'
import * as api from '../../api'
import { AppActions } from '../app'
import * as appActions from '../app/app.actions'
import {
  getFieldsResource,
  getFoldersResource,
  getInventoryResource,
  ResourceSelectors,
} from '../selectors/resource.selectors'
import * as actions from './discogs.actions'

export function* fetchResource<T>(
  selector: ResourceSelectors,
  body?: SearchParams,
): Generator<SelectEffect | CallEffect | PutEffect, T, T> {
  let result: T = undefined as unknown as T
  try {
    const resource = yield select(selector)
    if (resource) {
      result = yield call(api.fetch as any, resource, body)
    } else {
      yield put(appActions.getUser())
    }
  } catch (error) {
    yield put(appActions.warn({ error: error as Error }))
  }
  return result
}
function* getReleasePageItem(): Generator<any> {
  try {
    const master = yield call(api.getReleasePageItem)
    if (master) {
      yield put(actions.getReleasePageItemSuccess(master as ReleasePageItem))
    }
  } catch (error) {
    console.log(error)
  }
}

function* getDiscogsInventory(): Generator<any> {
  yield fetchResource(getInventoryResource)
  yield fetchResource(getFoldersResource)
  yield fetchResource(getFieldsResource)
}

function* DiscogsSaga() {
  yield all([takeLatest(AppActions.getUserSuccess, getReleasePageItem)])
}

export default DiscogsSaga
