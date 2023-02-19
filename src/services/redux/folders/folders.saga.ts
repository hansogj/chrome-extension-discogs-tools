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
import { actions as appActions, AppActions, sagas as appSagas } from '../app';
import { selectors as discogsSelectors } from '../discogs';
import * as combinedSelectors from '../selectors/combined.selectors';
import {
  sagas as userSagas,
  selectors as userSelectors,
  UserActions,
  UserActionTypes,
} from '../user';
import * as actions from './folders.actions';
import * as folderSelectors from './selectors';
import { FoldersActions, FoldersActionTypes } from './types';

export function* getFolders() {
  const result: { folders: Folder[] } = yield userSagas.fetchUserResource('collection_folders_url');

  yield put(
    maybe(result)
      .mapTo('folders')
      .nothingUnless(Boolean)
      .map(actions.getFoldersSuccess)
      .valueOr(appActions.warn({ message: getText('folder.fetched.failed') })),
  );
}

export function* getFields() {
  const result: { fields: InventoryFields } = yield call(
    userSagas.fetchUserResource,
    'collection_fields_url',
  );

  yield put(
    result && result.fields
      ? actions.getInventoryFieldsSuccess(result.fields)
      : appActions.warn({ message: getText('fields.fetched.failed') }),
  );
}

export function* setSelectedFields({ selectedFields }: FoldersActionTypes) {
  const userId: number = yield select(userSelectors.getUserId);
  const allFields: SelectedFields = yield call(selectedFieldsService.set, userId, selectedFields!);
  yield put(actions.setSelectedFieldsSuccess(allFields));
}

export function* getSelectedFields() {
  const userId: number = yield select(userSelectors.getUserId);
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
      action: appActions.goToUrl({ url: uri }),
      text: 'Yes please',
    },
  );
}

export function* raceForResponse(): Generator<any> {
  const result = yield race({
    notify: take(AppActions.APP_NOTIFY_RESET),
    remove: take(AppActions.APP_GO_TO_URL),
  });

  if ((result as any).notify) {
    yield api.reload();
  } else {
    yield put(actions.addToFolderSuccess());
  }
}

function* onUserSuccess({ user }: UserActionTypes) {
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
    takeLatest(UserActions.GET_USER, onUserSuccess),
    takeLatest(FoldersActions.setSelectedFields, setSelectedFields),
    takeLatest(FoldersActions.addToFolder, addToFolder),
  ]);
}

export default DiscogsSaga;
