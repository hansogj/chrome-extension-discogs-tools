import { MockUtil } from '../../../gist/jest-utils/jest.utils';
import { shape } from '../../../_mock_';
import * as discogsSelectors from '../discogs/selectors';
import * as foldersSelectors from '../folders/selectors';
import * as inventorySelectors from '../inventory/selectors';
import * as userSelectors from '../user/selectors';
import {
  combinedGetAddReleaseToFolderResource,
  getAllFoldersReleasesResource,
  getCollectedArtistReleases,
  getWantedArtistReleases,
} from './combined.selectors';

import { user as userMock } from '../user/_mocks_';
import { wantList as wantListMock, collection as collectionMock } from '../inventory/_mocks_';
import { WantList } from '../../../domain';

jest
  .mock('../discogs/selectors')
  .mock('../folders/selectors')
  .mock('../user/selectors')
  .mock('../inventory/selectors');

const mocks = MockUtil<
  typeof discogsSelectors &
    typeof foldersSelectors &
    typeof userSelectors &
    typeof inventorySelectors
>(jest).requireMocks(
  '../discogs/selectors',
  '../folders/selectors',
  '../user/selectors',
  '../inventory/selectors',
);

describe('redux combined selectors', () => {
  describe('combinedGetAddReleaseToFolderResource', () => {
    describe.each([
      [undefined, undefined, {}, 'releases'] as any,
      [123, undefined, {}, 'releases/123'] as any,
      [123, 'folder', {}, 'folder/releases/123'] as any,
      [123, 'folder', { folders: 'vinyl' }, 'folder/vinyl/releases/123'] as any,
      [
        123,
        userMock.collection_folders_url,
        { folders: 'vinyl' },
        'https://api.discogs.com/users/murdrejg/collection/folders/vinyl/releases/123',
      ] as any,
    ] as Array<[number, string, string[], string]>)(
      `with \n\tgetReleasePageId: %s \n\t getFoldersResource: %j \n\t getSelectedFields: %j \n\t`,
      (getReleasePageId, getFoldersResource, getSelectedFields, expected) => {
        beforeEach(() => {
          mocks.getReleasePageId?.mockReturnValue(getReleasePageId);
          mocks.getFoldersResource?.mockReturnValue(getFoldersResource);
          mocks.getSelectedFields?.mockReturnValue(getSelectedFields);
        });

        it(`should result in ${shape(expected)}`, () =>
          expect(combinedGetAddReleaseToFolderResource({} as any)).toEqual(expected));
      },
    );
  });

  describe('getAllFoldersReleasesResource', () => {
    describe.each([
      [undefined, '/0/releases'] as any,
      ['folders', 'folders/0/releases'] as any,
      [
        userMock.collection_folders_url,
        'https://api.discogs.com/users/murdrejg/collection/folders/0/releases',
      ] as any,
    ] as Array<[string, string]>)(
      `with \n\tgetFoldersResource: %j`,
      (getFoldersResource, expected) => {
        beforeEach(() => {
          mocks.getFoldersResource?.mockReturnValue(getFoldersResource);
        });

        it(`should result in ${shape(expected)}`, () =>
          expect(getAllFoldersReleasesResource({} as any)).toEqual(expected));
      },
    );
  });
  describe('getWantedArtistReleases', () => {
    describe.each([
      [undefined, undefined, undefined] as any,
      [1380518, undefined, undefined] as any,
      [1380518, [], []],
      [1, wantListMock, []],
      [1380518, wantListMock, [wantListMock[1]?.mainRelease]],
      [3068399, wantListMock, [wantListMock[2]?.mainRelease, wantListMock[6]?.mainRelease]],
    ] as Array<[number, WantList.Item[], string]>)(
      `with \n\tgetArtistId: %s`,
      (getArtistId, getWantList, expected) => {
        beforeEach(() => {
          mocks.getArtistId?.mockReturnValue(getArtistId);
          mocks.getWantList?.mockReturnValue(getWantList);
        });

        it(`and getWantList is ${
          getWantList && !!getWantList.length ? 'non empty' : shape(getWantList)
        } should result in ${shape(expected)}`, () =>
          expect(getWantedArtistReleases({} as any)).toEqual(expected));
      },
    );
  });

  describe('getCollectedArtistReleases', () => {
    describe.each([
      [undefined, undefined, undefined] as any,
      [1380518, undefined, undefined] as any,
      [1380518, [], []],
      [1, collectionMock, []],
      [179749, collectionMock, [collectionMock[4]]],
      [6109153, collectionMock, [collectionMock[0], collectionMock[1], collectionMock[2]]],
      // [3068399, collectionMock, [collectionMock[2], collectionMock[6]]],
    ] as Array<[number, WantList.Item[], string]>)(
      `with \n\tgetArtistId: %s`,
      (getArtistId, getCollection, expected) => {
        beforeEach(() => {
          mocks.getArtistId?.mockReturnValue(getArtistId);
          mocks.getCollection?.mockReturnValue(getCollection);
        });

        it(`and getWantList is ${
          getCollection && !!getCollection.length ? 'non empty' : shape(getCollection)
        } should result in ${shape(expected)}`, () =>
          expect(getCollectedArtistReleases({} as any)).toEqual(expected));
      },
    );
  });
});
