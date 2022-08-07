import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { HightlightedLabels, OauthIdentity, User } from '../../../domain'
import { get, set } from '../../storage'
import * as userTokenService from '../../userToken.service'
import * as api from '../../api'
import { DiscogsActions } from '../discogs'
import * as appSelectors from '../selectors/app.selectors'
import { AppActions, AppActionTypes, DISCOGS_BASE_URL, ERROR, View } from './'
import * as actions from './app.actions'
import { ActionButton } from './types'
import * as labelService from '../../highlighted.labels.service'
import { MAX_LOGIN_ATEMPTS } from '../../../constants'

function* getUser(_: any, count = 0): Generator<any> {
  try {
    const storedToken = yield call(userTokenService.get)
    if (!Boolean(storedToken)) throw new Error(ERROR.NOT_AUTHENTICATED)
    const identity = yield call(api.fetch, `${DISCOGS_BASE_URL}/oauth/identity`)
    if (identity) {
      const user = yield call(
        api.fetch,
        (identity as OauthIdentity).resource_url,
      )
      yield put(actions.getUserSuccess(user as User))
      return true
    } else {
      if (count < MAX_LOGIN_ATEMPTS) {
        yield getUser(_, count + 1)
      } else throw new Error(ERROR.NOT_AUTHENTICATED)
    }
  } catch (error) {
    console.log(error)
    yield put(actions.error(ERROR.NOT_AUTHENTICATED))
  }
}

export function* getUserId(): Generator<number> {
  const userId = yield select(appSelectors.getUserId) as any
  if (userId) {
    yield userId as number
    return userId
  } else {
    throw new Error('Cannot find any userId ')
  }
}

export function* notify(
  message: string,
  actionBtn?: ActionButton,
  timeout = 5000,
) {
  yield put(actions.notify({ message, actionBtn }))
  yield delay(timeout)
  yield put(actions.notifyReset())
}

export function* warn(message: string, timeout = 5000) {
  yield put(actions.warn({ message }))
  yield delay(timeout)
  yield put(actions.notifyReset())
}

function* setUserToken({ userToken }: AppActionTypes): Generator<any> {
  if (userToken) {
    yield call(userTokenService.set, userToken!)
    yield call(getUser, 0)
  } else {
    yield call(userTokenService.remove)
    yield put(actions.logOutSuccess())
  }
}

function* setView({ view }: AppActionTypes): Generator<any> {
  const storedView = yield call(set, 'view', view)
  yield put(actions.setViewSuccess(storedView as View))
}
function* getView(): Generator<any> {
  const view = yield call(get, 'view', '')
  yield put(actions.setViewSuccess(view as View))
}

function* setHighglightedLabels({
  highlightedLabels: labels,
}: AppActionTypes): Generator<any> {
  try {
    yield call(labelService.set, labels!)
    yield put(
      actions.setHighglightedLabelsSuccess(labels as HightlightedLabels),
    )
    yield call(api.applyHighglightedLabels)
  } catch (e) {
    debugger
  }
}

function* getHightlightedLabels(): Generator<any> {
  try {
    const labels = yield call(labelService.get)
    if (labels) {
      yield put(
        actions.getHighglightedLabelsSuccess(labels as HightlightedLabels),
      )
      yield call(api.applyHighglightedLabels)
    }
  } catch (e) {
    debugger
  }
}

function* onUserSuccess(): Generator<any> {
  yield all([getView(), getHightlightedLabels()])
}

function* goToUrl({ url }: AppActionTypes): Generator<any> {
  yield api.manipulateDom(DiscogsActions.domGoTo, `${url}`)
}

function* AppSaga() {
  try {
    yield all([
      takeLatest(AppActions.getUser, getUser),
      takeLatest(AppActions.logOut, setUserToken),
      takeLatest(AppActions.setUserToken, setUserToken),
      takeLatest(AppActions.setUserTokenSuccess, getUser),
      takeLatest(AppActions.setView, setView),
      takeLatest(AppActions.getUserSuccess, onUserSuccess),
      takeLatest(AppActions.setHighglightedLabels, setHighglightedLabels),
      takeLatest(AppActions.goToUrl, goToUrl),
    ])
  } catch (e) {
    console.error(e)
  }
}

export default AppSaga
