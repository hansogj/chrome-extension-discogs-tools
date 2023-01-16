import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { DropdownInventoryField, SelectedFields } from '../../../domain';
import { FoldersState } from '../folders';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../../../gist/immer-utils/immer.utils';

export const getFoldersState = (state: Partial<RootState>): FoldersState =>
  selectFromRoot(state, 'Folders')!;

export const getFolders = createSelector(getFoldersState, (folderState) =>
  maybe(folderState).mapTo('folders').valueOr([]),
);

export const getCollectableFolders = createSelector(getFolders, (folders) =>
  folders.filter((it) => it.id !== 0),
);
export const getIsAddingToFolder = createSelector(getFoldersState, (folderState) =>
  maybe(folderState).mapTo('addingToFolder').valueOr(false),
);

export const getFields = createSelector(
  getFoldersState,
  (folderState) =>
    maybe(folderState)
      .mapTo('fields')
      .map((it) => it.filter((field) => field.type === 'dropdown'))
      .valueOr([]) as DropdownInventoryField[],
);

const getSelectedAbleFields = createSelector(getFoldersState, (folderState) =>
  maybe(folderState)
    .mapTo('selectedFields')
    .valueOr({} as SelectedFields),
);

export const getSelectedFields = createSelector(
  getSelectedAbleFields,
  getFields,
  getCollectableFolders,
  (selectableFields, fields, folders) =>
    fields.reduce(
      (res, { id, options }) => ({
        ...res,
        [id]: maybe(res as typeof selectableFields)
          .mapTo('' + id)
          .valueOr(options[0]),
      }),
      {
        ...selectableFields,
        ...{
          folders: maybe(selectableFields)
            .mapTo('folders')
            .or(
              maybe(folders)
                .map((it) => it[0])
                .mapTo('id')
                .stringify(),
            )
            .valueOr('0'),
        },
      },
    ),
);
