import { testSaga } from 'redux-saga-test-plan';
import { Folder, InventoryFields } from '../../../domain';
import { getText } from '../../texts';
import { actions as appActions } from '../app';
import { syncCollection, syncWantList, wantlistIsSyncing } from './inventory.saga';
import { selectors as userSelectors, UserActions, UserActionTypes } from '../user';
import * as api from '../../api';

import * as combinedSelectors from '../selectors/combined.selectors';

import { user as userMock } from '../user/_mocks_';

jest.mock('../../api', () => ({
  __esModule: true,
  syncWantList: jest.fn,
  syncCollection: jest.fn,
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
        .next(wantlistIsSyncing)
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
        .next(wantlistIsSyncing)
        .next()
        .isDone();
    });
  });
});
