import { testSaga } from 'redux-saga-test-plan';
import { call, take } from 'redux-saga/effects';
import { Folder, Instance, InventoryFields, Release } from '../../../domain';
import * as api from '../../api';
import * as selectedFieldsService from '../../selectedFields.service';
import { getText, renderText } from '../../texts';
import {
  actions as appActions,
  AppActions,
  sagas as appSagas,
  selectors as appSelectors,
} from '../app';
import * as discogsSelectors from '../discogs/selectors';
import * as combinedSelectors from '../selectors/combined.selectors';
import * as folderActions from './folders.actions';
import {
  addToFolder,
  getFields,
  getFolders,
  getSelectedFields,
  notifyNewInstance,
  raceForResponse,
  setSelectedFields,
  updateSelectedFieldsValues,
} from './folders.saga';

import * as folderSelectors from './selectors';

jest.mock('../../api', () => ({
  __esModule: true,
  post: jest.fn,
  reload: jest.fn,
}));
describe('folder saga', () => {
  const FOLDERS: Folder[] = [{ name: 'FOLDER', id: 123 } as Folder];
  const INVENTORY_FIELDS: InventoryFields = [{ name: 'FIELD', id: 456 } as any];
  describe('getFolders', () => {
    it('should get folders and yield result', () => {
      testSaga(getFolders)
        .next()
        .next({ folders: FOLDERS })
        .put(folderActions.getFoldersSuccess(FOLDERS))
        .next()
        .isDone();
    });
    it('when failed, should yield warning', () => {
      testSaga(getFolders)
        .next()
        .next()
        .put(appActions.warn({ message: getText('folder.fetched.failed') }))
        .next()
        .isDone();
    });
  });

  describe('getField', () => {
    it('should get fields and yield result', () => {
      testSaga(getFields)
        .next()
        .next({ fields: INVENTORY_FIELDS })
        .put(folderActions.getInventoryFieldsSuccess(INVENTORY_FIELDS))
        .next()
        .isDone();
    });
    it('when failed, should yield warning', () => {
      testSaga(getFields)
        .next()
        .next()
        .put(appActions.warn({ message: getText('fields.fetched.failed') }))
        .next()
        .isDone();
    });
  });

  describe('setSelectedFields', () => {
    const userId = 12345;
    it('should retrieve userId, call service and yield current stored selection', () => {
      testSaga(setSelectedFields, folderActions.setSelectedFields({}))
        .next()
        .select(appSelectors.getUserId)
        .next(userId)
        .call(selectedFieldsService.set, userId, {})
        .next({ field: 'value' })
        .put(folderActions.setSelectedFieldsSuccess({ field: 'value' }))
        .next()
        .isDone();
    });
    it('should retrieve userId, call service and yield updated selection', () => {
      testSaga(setSelectedFields, folderActions.setSelectedFields({ new: 'newVal' }))
        .next()
        .select(appSelectors.getUserId)
        .next(userId)
        .call(selectedFieldsService.set, userId, { new: 'newVal' })
        .next({ field: 'value', new: 'newVal' })
        .put(folderActions.setSelectedFieldsSuccess({ field: 'value', new: 'newVal' }))
        .next()
        .isDone();
    });
  });
  describe('getSelectedFields', () => {
    const userId = 12345;

    it('should retrieve userId, call service and yield updated selection', () => {
      testSaga(getSelectedFields)
        .next()
        .select(appSelectors.getUserId)
        .next(userId)
        .call(selectedFieldsService.get, userId)
        .next({ field: 'value' })
        .put(folderActions.setSelectedFieldsSuccess({ field: 'value' }))
        .next()
        .isDone();
    });
  });

  describe('addToFolder', () => {
    const releasePageId = 987654321;

    it('post add to folder resource and', () => {
      testSaga(addToFolder)
        .next()
        .select(discogsSelectors.getReleasePageId)
        .next(releasePageId)
        .select(combinedSelectors.combinedGetAddReleaseToFolderResource)
        .next('/resource/' + releasePageId)
        .call(api.post, '/resource/' + releasePageId)
        .next()
        .next(updateSelectedFieldsValues)
        .fork(notifyNewInstance)
        .next(raceForResponse)
        .next()
        .isDone();
    });

    it('yield warning', () => {
      testSaga(addToFolder)
        .next()

        .select(discogsSelectors.getReleasePageId)
        .next(releasePageId)
        .select(combinedSelectors.combinedGetAddReleaseToFolderResource)
        .next()
        .fork(appSagas.warn, 'Failing to add new item 987654321')
        .next()
        .isDone();
    });
  });

  describe('updateSelectedFieldsValues', () => {
    const instance: Instance = {
      instance_id: 123,
      resource_url: '/resource/123',
      basic_information: {} as any,
    };

    it('should extract instance data from instance and call field resource for each field', () => {
      testSaga(updateSelectedFieldsValues, instance)
        .next()
        .select(folderSelectors.getSelectedFields)
        .next({ field1: 'val', field2: 'no val' })

        .all([
          call(api.post, '/resource/123/instances/123/fields/field1', {
            payLoad: { value: 'val' },
          }),
          call(api.post, '/resource/123/instances/123/fields/field2', {
            payLoad: { value: 'no val' },
          }),
        ])
        .next()
        .isDone();
    });
  });

  describe('notifyNewInstance', () => {
    const masterRelease = {
      title: 'TITLE',
      artists: [{ name: 'ARTIST' }],
      uri: 'MASTER_URI',
    } as Release.MasterReleaseDTO;

    it('fetch data from master release and apply to app notification', () => {
      testSaga(notifyNewInstance)
        .next()
        .select(discogsSelectors.getReleasePageMaster)
        .next(masterRelease)
        .fork(
          appSagas.notify,
          renderText('folder.add.item.success', {
            artist: 'ARTIST',
            title: 'TITLE',
          }),
          {
            action: appActions.goToUrl('MASTER_URI'),
            text: 'Yes please',
          },
        )
        .next()
        .isDone();
    });
  });

  describe('raceForResponse', () => {
    it('should call reload when notification times out', () => {
      testSaga(raceForResponse)
        .next()
        .race({
          notify: take(AppActions.notifyReset),
          remove: take(AppActions.goToUrl),
        })
        .next({ notify: 'notification wins' })
        .next(api.reload())
        .next()
        .isDone();
    });

    it(`should yield ${folderActions.addToFolderSuccess().type}  when go to url wins`, () => {
      testSaga(raceForResponse)
        .next()
        .race({
          notify: take(AppActions.notifyReset),
          remove: take(AppActions.goToUrl),
        })
        .next({ remove: 'go to url' })
        .put(folderActions.addToFolderSuccess())
        .next()
        .isDone();
    });
  });
});
