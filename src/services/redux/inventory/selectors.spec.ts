import { Optional } from '@hansogj/maybe';
import { CombinedState } from 'redux';
import { RootState } from '../root.reducers';
import { getCollection, getInventory, getWantList, getSyncStatus } from './selectors';
import { InventoryState, SyncStatus } from './types';
import { shape } from '../../../_mock_/';
import { asyncOk } from '../domain';
import { initialSyncStatus } from './inventory.reducer';
describe('Inventory selectors', () => {
  type State = Partial<CombinedState<InventoryState>>;

  describe.each([
    [undefined, undefined as any],
    [{}, undefined as any],
    [{ Inventory: {} }, undefined],
    [{ Inventory: { wantList: 'wantList' } }, 'wantList'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with RootState %j', (rootState, expected) => {
    it(`getWantList should be ${expected}`, () =>
      expect(getWantList(rootState as State)).toEqual(expected));
  });

  describe.each([
    [undefined, undefined as any],
    [{}, undefined as any],
    [{ Inventory: {} }, undefined],
    [{ Inventory: { collection: 'collection' } }, 'collection'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with RootState %j', (rootState, expected) => {
    it(`getCollection should be ${expected}`, () =>
      expect(getCollection(rootState as State)).toEqual(expected));
  });

  describe.each([
    [undefined, initialSyncStatus()],
    [{}, initialSyncStatus()],
    [{ Inventory: {} }, initialSyncStatus()],
    [{ Inventory: { syncStatus: initialSyncStatus() } }, initialSyncStatus()],
    [
      {
        Inventory: {
          syncStatus: {
            wantList: asyncOk('wantlist'),
            collection: asyncOk('wantlist'),
          },
        },
      },
      {
        wantList: asyncOk('wantlist'),
        collection: asyncOk('wantlist'),
      },
    ],
  ] as Array<[Optional<Partial<RootState>>, SyncStatus]>)(
    'with RootState %j',
    (rootState, expected) => {
      it(`getSyncStatus should be ${expected}`, () =>
        expect(getSyncStatus(rootState as State)).toEqual(expected));
    },
  );

  describe.each([
    [{}, { wantList: 0, collection: 0 }],

    [
      { wantList: undefined, collection: undefined },
      { wantList: 0, collection: 0 },
    ],

    [
      { wantList: [1, 2, 3], collection: [1, 2] },
      { wantList: 3, collection: 2 },
    ],
  ] as Array<[Optional<Partial<RootState>>, { wantList: number; collection: number }]>)(
    'with InventoryState %j',
    (Inventory, expected) => {
      it(`getInventory should be ${shape(expected)}`, () =>
        expect(getInventory({ Inventory } as State)).toEqual(expected));
    },
  );
});
