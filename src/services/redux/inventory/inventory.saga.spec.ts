import { testSaga } from 'redux-saga-test-plan';
import { Collection, WantList } from '../../../domain';
import * as api from '../../api';
import * as collectionService from '../../collection.service';
import { selectors as userSelectors } from '../user';
import {
  getCollection,
  getWantList,
  syncCollection,
  syncWantList,
  inventoryIsSyncing,
} from './inventory.saga';

import * as wantListService from '../../wantlist.service';
import * as combinedSelectors from '../selectors/combined.selectors';
import * as inventoryActions from './inventory.actions';
import { user as userMock } from '../user/_mocks_';
import { collection as collectionMock, wantList as wantListMock } from './_mocks_';
import { AsyncData } from '@swan-io/boxed';
import { SyncStatus } from './types';

jest.mock('../../api', () => ({
  __esModule: true,
  syncWantList: jest.fn,
  syncCollection: jest.fn,
  hasOngoingSync: jest.fn,
  getSyncStatus: jest.fn,
}));
describe('inventory saga', () => {
  describe('syncWantList', () => {
    it('should get wantlist resource and userId from user, call api to start syncing and finally notify', () => {
      testSaga(syncWantList)
        .next()
        .select(userSelectors.getWantListResource)
        .next(userMock.wantlist_url)
        .select(userSelectors.getUserId)
        .next(userMock.id)
        .call(api.syncWantList, userMock.id, userMock.wantlist_url)
        .next()
        .next(inventoryIsSyncing)
        .next()
        .isDone();
    });
  });

  describe('syncCollection', () => {
    it('should get release resource and userId from user, call api to start syncing and finally notify', () => {
      testSaga(syncCollection)
        .next()
        .select(combinedSelectors.getAllFoldersReleasesResource)
        .next(userMock.collection_folders_url + '/0/releases')
        .select(userSelectors.getUserId)
        .next(userMock.id)
        .call(api.syncCollection, userMock.id, userMock.collection_folders_url + '/0/releases')
        .next()
        .next(inventoryIsSyncing)
        .next()
        .isDone();
    });
  });

  describe('getWantList', () => {
    it('when wantList has items, should get stored wantlist from service and put to state', () => {
      testSaga(getWantList)
        .next()
        .select(userSelectors.getUserId)
        .next(123)
        .call(wantListService.get, 123)
        .next(wantListMock)
        .put(inventoryActions.getWantListSuccess({ wantList: wantListMock as WantList.Item[] }))
        .next()
        .isDone();
    });

    it('when wantList is empty, should get stored wantlist from service and done', () => {
      testSaga(getWantList)
        .next()
        .select(userSelectors.getUserId)
        .next(123)
        .call(wantListService.get, 123)
        .next([])
        .isDone();
    });
  });

  describe('getCollection', () => {
    it('when collection has items, should get stored wantlist from service and put to state', () => {
      testSaga(getCollection)
        .next()
        .select(userSelectors.getUserId)
        .next(123)
        .call(collectionService.get, 123)
        .next(collectionMock)
        .put(
          inventoryActions.getCollectionSuccess({
            collection: collectionMock as Collection.Item[],
          }),
        )
        .next()
        .isDone();
    });

    it('when collection is empty, should get stored wantlist from service and done', () => {
      testSaga(getCollection)
        .next()
        .select(userSelectors.getUserId)
        .next(123)
        .call(collectionService.get, 123)
        .next([])
        .isDone();
    });
  });

  describe('inventoryIsSyncing', () => {
    it('calls itself recursive every 2 seconds to check if api has ongoing sync', () => {
      const syncStatus: SyncStatus = {
        wantList: AsyncData.Loading(),
        collection: AsyncData.NotAsked(),
      };
      testSaga(inventoryIsSyncing)
        .next()
        .call(api.getSyncStatus)
        .next(syncStatus)
        .put(inventoryActions.setSyncStatus({ syncStatus }))
        .next()
        .delay(2000)
        .next(inventoryIsSyncing)
        .next()
        .isDone();
    });

    it('should call for wantlist and collection when done', () => {
      const syncStatus: SyncStatus = {
        wantList: AsyncData.NotAsked(),
        collection: AsyncData.NotAsked(),
      };
      testSaga(inventoryIsSyncing)
        .next()
        .call(api.getSyncStatus)
        .next(syncStatus)
        .put(inventoryActions.setSyncStatus({ syncStatus }))
        .next()
        .next(getWantList)
        .next(getCollection)
        .next()
        .isDone();
    });
  });
});
