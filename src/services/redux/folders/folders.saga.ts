import '@hansogj/array.utils'
import maybe from 'maybe-for-sure'
import {
  all,
  call,
  fork,
  put,
  race,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects'
import {
  Artist,
  Folder,
  Instance,
  InventoryFields,
  MasterRelease,
  ReleasePageItem,
} from '../../../domain'
import * as api from '../../api'
import { renderText } from '../../texts'
import { actions as appActions, AppActions, sagas as appSagas } from '../app'
import { sagas as discogsSaga } from '../discogs'
import {
  fromReleasePageMaster,
  getAddReleaseToFolderResource,
  getCollectionResource,
  getFieldsResource,
  getFoldersResource,
  getReleasePageId,
  getSelectedFields as getSelectedFieldsSelector,
} from '../selectors'
import * as actions from './folders.actions'
import { FoldersActions, FoldersActionTypes } from './types'

function* getFolders(): Generator<any> {
  const result = yield discogsSaga.fetchResource(getFoldersResource)
  if (result) {
    yield put(
      actions.getFoldersSuccess((result as { folders: Folder[] }).folders),
    )
  }
}

function* getFields(): Generator<any> {
  const result = yield discogsSaga.fetchResource(getFieldsResource)
  if (result)
    yield put(
      actions.getInventoryFieldsSuccess(
        (result as { fields: InventoryFields }).fields,
      ),
    )
}

function* setSelectedFields({
  selectedFields,
}: FoldersActionTypes): Generator<any> {
  const userId = yield call(appSagas.getUserId)
  const allFields = yield call(
    api.setSelectedFields,
    userId as number,
    selectedFields!,
  )
  yield put(
    actions.setSelectedFieldsSuccess(allFields as Record<string, string>),
  )
}

function* getSelectedFields(): Generator<any> {
  const userId = yield call(appSagas.getUserId)
  const allFields = yield call(api.getSelectedFields, userId as number)

  yield put(
    actions.setSelectedFieldsSuccess(allFields as Record<string, string>),
  )
}

function* addToFolder(): Generator<any> {
  const releaseId = (yield select(
    getReleasePageId,
  )) as ReleasePageItem['releaseId']

  try {
    const resource = yield select(getAddReleaseToFolderResource(releaseId))
    if (resource) {
      const result = (yield call(api.post, resource as string)) as Instance
      yield updateSelectedFieldsValues(result)
      yield fork(notifyNewInstance, result)
      yield raceForResponse()
    } else {
      yield fork(
        appSagas.warn,
        renderText('folder.add.item.failed', { releaseId }),
      )
    }
  } catch (error) {
    yield fork(
      appSagas.warn,
      renderText('folder.fetch.item.failed', { releaseId }),
    )
  }
}

function* updateSelectedFieldsValues(instance: Instance): Generator<any> {
  const fields = (yield select(getSelectedFieldsSelector)) as Record<
    string,
    string
  >

  const url = instance.resource_url
    .split('?')
    .first()
    .concat(['instances', `${instance?.instance_id}`])
    .join('/')

  yield all(
    Object.entries(fields)
      .filter(([field, _]) => field !== 'folders')
      .map(([field_id, value]) => ({
        resource: `${url}/fields/${field_id}`,
        payLoad: { value },
      }))

      .map(({ resource, payLoad }) =>
        call(api.post as any, resource, { payLoad }),
      ),
  )
}

function* getCollection(): Generator<any> {
  yield discogsSaga.fetchResource(getCollectionResource)
}

function* notifyNewInstance(instance: Instance): Generator<any> {
  const resource = maybe(instance)
    .mapTo('basic_information')
    .map(({ master_url, resource_url }) => master_url || resource_url)
    .valueOr(undefined)

  if (!resource) throw new Error('Now resource found on instance')

  const title = (yield select(
    fromReleasePageMaster('title'),
  )) as MasterRelease['title']
  const artists = (yield select(
    fromReleasePageMaster('artists'),
  )) as MasterRelease['artists']

  const artist = maybe(artists)
    .map((it) => it[0] as Artist)
    .map(({ name }) => name)
    .valueOr('')
  const masterUrl = yield select(fromReleasePageMaster('uri'))

  yield fork(
    appSagas.notify,
    renderText('folder.add.item.success', {
      artist,
      title,
    }),
    {
      action: appActions.goToUrl(masterUrl as string),
      text: 'Yes please',
    },
  )
}

function* raceForResponse(): Generator<any> {
  const result = yield race({
    notify: take(AppActions.notifyReset),
    remove: take(AppActions.goToUrl),
  })
  if ((result as any).notify) {
    yield api.reload()
  } else {
    yield put(actions.addToFolderSuccess())
  }
}

function* onUserSuccess() {
  try {
    yield put(appActions.notifyReset())
    yield all([getFolders(), getFields(), getSelectedFields()])
  } catch (e) {
    console.log(e)
  }
}

function* DiscogsSaga() {
  yield all([
    takeLatest(AppActions.getUserSuccess, onUserSuccess),
    takeLatest(FoldersActions.getFoldersSuccess, getCollection),
    takeLatest(FoldersActions.setSelectedFields, setSelectedFields),
    takeLatest(FoldersActions.addToFolder, addToFolder),
  ])
}

export default DiscogsSaga
