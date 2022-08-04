import '@hansogj/array.utils'
import {
  all,
  call,
  delay,
  fork,
  put,
  select,
  spawn,
  takeLatest,
} from 'redux-saga/effects'
import { Version, WantList } from '../../../domain'
import * as api from '../../api'
import { getText } from '../../texts'
import { AppActions, sagas as appSagas } from '../app'
import { fromReleasePageMaster } from '../selectors'
import { getWantListResource } from '../selectors/resource.selectors'
import { WantListActions, WantListActionTypes } from './types'
import * as wantListActions from './wantlist.actions'

const MAX_REQUESTS_PR_MINUTE = 60 - 10 // -10 to get som slack
const second = 1000
function* syncWantList(): Generator<any> {
  const resource = yield select(getWantListResource)
  const userId = yield call(appSagas.getUserId)
  const result = yield call(
    api.syncWantList,
    userId as number,
    resource as string,
  )
  yield put(wantListActions.getWantListSuccess(result as WantList))
  yield appSagas.notify('Want list has been synchronized')
}

function* getWantList(): Generator<any> {
  const userId = yield call(appSagas.getUserId)
  let result = yield call(api.getWantList, userId as number)
  if (Object.keys(result as any).length === 0) {
    yield call(syncWantList)
  } else {
    yield put(wantListActions.getWantListSuccess(result as WantList))
  }
}

function* addToWantList({ format }: WantListActionTypes): Generator<any> {
  console.log(format)
  const versions_url = yield select(fromReleasePageMaster('versions_url'))

  if (versions_url) {
    yield addToWantListFromVersionsUrl(versions_url, format)
  } else {
    yield appSagas.warn(getText('wantlist.add.item.failed'))
  }
}

function* addToWantListFromVersionsUrl(
  versions_url: unknown,
  format: Optional<Version['format']>,
): Generator<any> {
  const allVersions = (yield call(
    api.getAllWantedVersionsByFormat,
    versions_url as string,
    format as Optional<Version['format']>,
  )) as Version[]
  const wantListResource = yield select(getWantListResource)
  const noOfVersions = allVersions.length
  if (noOfVersions > 0) {
    console.time('addWantList')
    try {
      yield* allVersions.map(function* ({ id }, i, self) {
        if (i % 10 === 0) {
          yield spawn(
            appSagas.notify,
            `<h3>Hang out there!</h3>
                      Expected remaining time of operation is ${
                        noOfVersions - i
                      } seconds <br /> Do not close extension or refresh webpage`,
            undefined,
            10 * second,
          )
        }

        const interval =
          self.length > MAX_REQUESTS_PR_MINUTE ? second * 1.2 : 100
        yield delay(interval)
        try {
          const del = yield fork(api.put, `${wantListResource}/${id}`)

          console.log(new Date().getSeconds(), del)
          console.timeStamp('addWantList')
        } catch (error) {
          debugger
          yield fork(
            appSagas.notify,
            `<h3>Hang out there!</h3>
                        Due to restrictions from Discogs api we have to wait another minute before continue
                        } seconds <br /> Do not close extension or refresh webpage`,
            undefined,
            second * 60,
          )

          debugger
          const del = yield fork(api.put, `${wantListResource}/${id}`)
        }
      })
    } catch (error) {
      debugger
    }
    console.timeEnd('addWantList')

    yield appSagas.notify(
      `<h3>Congratulation!</h3>
      ${noOfVersions} new items of format ${
        format ? format : 'all'
      } added to you want list`,
    )
  } else {
    yield appSagas.notify(
      `No items of format ${format} to be added to your want list `,
    )
  }
}

function* DiscogsSaga() {
  yield all([
    takeLatest(AppActions.getUserSuccess, getWantList),
    takeLatest(WantListActions.syncWantList, syncWantList),
    takeLatest(WantListActions.addToWantList, addToWantList),
  ])
}

export default DiscogsSaga
