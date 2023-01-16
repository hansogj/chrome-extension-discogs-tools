import '@hansogj/array.utils';
import maybe from '@hansogj/maybe';
import { all, call, fork, put, race, select, take, takeLatest } from 'redux-saga/effects';
import {
  Artist,
  Folder,
  Instance,
  InventoryFields,
  Release,
  ReleasePageItem,
  SelectedFields,
} from '../../../domain';
import * as api from '../../api';
import * as selectedFieldsService from '../../selectedFields.service';
import { getText, renderText } from '../../texts';
import {
  actions as appActions,
  AppActions,
  AppActionTypes,
  sagas as appSagas,
  selectors as appSelectors,
} from '../app';
import { sagas as discogsSaga, selectors as discogsSelectors } from '../discogs';
import * as combinedSelectors from '../selectors/combined.selectors';
import * as actions from './folders.actions';
import * as folderSelectors from './selectors';
import { FoldersActions, FoldersActionTypes } from './types';

export function* getFolders() {
  const result: { folders: Folder[] } = yield discogsSaga.fetchResource(
    combinedSelectors.getFoldersResource,
  );
  if (result && result.folders) yield put(actions.getFoldersSuccess(result.folders));
  else yield put(appActions.warn({ message: getText('folder.fetched.failed') }));
}

export function* getFields() {
  const result: { fields: InventoryFields } = yield discogsSaga.fetchResource(
    combinedSelectors.getFieldsResource,
  );
  if (result && result.fields) yield put(actions.getInventoryFieldsSuccess(result.fields));
  else yield put(appActions.warn({ message: getText('fields.fetched.failed') }));
}

export function* setSelectedFields({ selectedFields }: FoldersActionTypes) {
  const userId: number = yield select(appSelectors.getUserId);
  const allFields: SelectedFields = yield call(selectedFieldsService.set, userId, selectedFields!);
  yield put(actions.setSelectedFieldsSuccess(allFields));
}

export function* getSelectedFields() {
  const userId: number = yield select(appSelectors.getUserId);
  const allFields: SelectedFields = yield call(selectedFieldsService.get, userId);
  yield put(actions.setSelectedFieldsSuccess(allFields));
}

export function* addToFolder() {
  const releaseId: ReleasePageItem['releaseId'] = yield select(discogsSelectors.getReleasePageId);

  try {
    const resource: string = yield select(combinedSelectors.combinedGetAddReleaseToFolderResource);

    if (resource) {
      const result: Instance = yield call(api.post, resource);
      yield updateSelectedFieldsValues(result);
      yield fork(notifyNewInstance);
      yield raceForResponse();
    } else {
      yield fork(appSagas.warn, renderText('folder.add.item.failed', { releaseId }));
    }
  } catch (error) {
    yield fork(appSagas.warn, renderText('folder.fetch.item.failed', { releaseId }));
  }
}

export function* updateSelectedFieldsValues(instance: Instance) {
  const fields: SelectedFields = yield select(folderSelectors.getSelectedFields);

  const url = instance.resource_url
    .split('?')
    .first()
    .concat(['instances', `${instance?.instance_id}`])
    .join('/');
  try {
    yield all(
      Object.entries(fields)
        .filter(([field, _]) => field !== 'folders')
        .map(([field_id, value]) => ({
          resource: `${url}/fields/${field_id}`,
          payLoad: { value },
        }))
        .map(({ resource, payLoad }) => call(api.post as any, resource, { payLoad })),
    );
  } catch (error) {
    console.log(error);
  }
}

export function* notifyNewInstance() {
  const { uri, title, artists }: Release.MasterReleaseDTO = yield select(
    discogsSelectors.getReleasePageMaster,
  );

  yield fork(
    appSagas.notify,
    renderText('folder.add.item.success', {
      artist: maybe(artists)
        .map((it) => it[0] as Artist)
        .map(({ name }) => name)
        .valueOr(''),
      title,
    }),
    {
      action: appActions.goToUrl(uri),
      text: 'Yes please',
    },
  );
}

export function* raceForResponse(): Generator<any> {
  const result = yield race({
    notify: take(AppActions.notifyReset),
    remove: take(AppActions.goToUrl),
  });

  if ((result as any).notify) {
    yield api.reload();
  } else {
    yield put(actions.addToFolderSuccess());
  }
}

function* onUserSuccess({ user }: AppActionTypes) {
  try {
    yield put(appActions.notifyReset());
    if (user?.isDone() && user?.get().isOk()) {
      yield all([getFolders(), getFields(), getSelectedFields()]);
    }
  } catch (e) {
    console.log(e);
  }
}

function* DiscogsSaga() {
  yield all([
    takeLatest(AppActions.getUser, onUserSuccess),
    takeLatest(FoldersActions.setSelectedFields, setSelectedFields),
    takeLatest(FoldersActions.addToFolder, addToFolder),
  ]);
}

export default DiscogsSaga;
