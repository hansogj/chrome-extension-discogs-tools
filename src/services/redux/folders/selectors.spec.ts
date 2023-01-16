import { Optional } from '@hansogj/maybe';
import { CombinedState } from 'redux';
import { Folder, InventoryFields } from '../../../domain';
import { shape } from '../../../_mock_';
import { RootState } from '../root.reducers';
import {
  getCollectableFolders,
  getFields,
  getFolders,
  getFoldersState,
  getIsAddingToFolder,
  getSelectedFields,
} from './selectors';
import { FoldersState } from './types';
const folders = [
  { id: 0, name: 'Default' },
  { id: 1, name: 'My Folder' },
] as any as Folder[];
const fields = [
  {
    id: 1,
    type: 'dropdown',
  },
  { id: 2, type: 'textarea' },
] as unknown as InventoryFields[];

type State = Partial<CombinedState<FoldersState>>;
describe('Folders selectors', () => {
  describe.each([
    [undefined, undefined as any],
    [{}, undefined as any],
    [{ Folders: 'FOLDERS' }, 'FOLDERS'],
  ] as Array<[Optional<Partial<RootState>>, State]>)('with RootState %j', (rootState, expected) => {
    it(`getFoldersState should be ${shape(expected)}`, () =>
      expect(getFoldersState(rootState as State)).toEqual(expected));
  });

  describe.each([
    [undefined, []],
    [[], []],
    [folders, folders],
  ] as Array<[State, Array<Folder>]>)('with FoldersState %j', (folders, expected) => {
    it(`getFolders should be ${shape(expected)}`, () =>
      expect(getFolders({ Folders: { folders } } as RootState)).toEqual(expected));
  });

  describe.each([
    [undefined, []],
    [[], []],
    [folders, [folders[1]]],
  ] as Array<[State, Array<Folder>]>)('with folders %j', (folders, expected) => {
    it(`getCollectableFolders should be ${shape(expected)}`, () =>
      expect(getCollectableFolders({ Folders: { folders } } as RootState)).toEqual(expected));
  });

  describe.each([
    [{}, false],
    [{ addingToFolder: undefined }, false],
    [{ addingToFolder: false }, false],
    [{ addingToFolder: true }, true],
  ] as Array<[State, Array<Folder>]>)('with FoldersState %j', (Folders, expected) => {
    it(`getIsAddingToFOlder should be ${shape(expected)}`, () =>
      expect(getIsAddingToFolder({ Folders } as RootState)).toEqual(expected));
  });

  describe.each([
    [undefined, []],
    [[], []],
    [fields, [fields[0]]],
  ] as Array<[State, Array<any>]>)('with FoldersState %j', (fields, expected) => {
    it(`getFields should be ${shape(expected)}`, () =>
      expect(getFields({ Folders: { fields } } as RootState)).toEqual(expected));
  });

  describe.each([
    [undefined, { folders: '0' }],
    [{}, { folders: '0' }],
    [{ fields: [] }, { folders: '0' }],
    [{ fields: [fields[1]] }, { folders: '0' }],
    [{ selectedFields: { 11: 'field value' } }, { 11: 'field value', folders: '0' }],
    [
      { selectedFields: { 11: 'field value' }, folders },
      { 11: 'field value', folders: '1' },
    ],
    [
      { selectedFields: { 11: 'field value' }, fields: [fields[1]] },
      { 11: 'field value', folders: '0' },
    ],

    [
      { selectedFields: { 11: 'field value' }, fields: [fields[1]], folders },
      { 11: 'field value', folders: '1' },
    ],
  ] as Array<[any, Array<any>]>)('with FoldersState %j', (Folders, expected) => {
    it(`getSelectedAbleFields should be ${shape(expected)}`, () =>
      expect(getSelectedFields({ Folders } as RootState)).toEqual(expected));
  });
});
