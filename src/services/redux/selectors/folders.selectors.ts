import maybe from 'maybe-for-sure';
import { createSelector } from 'reselect';
import { DropdownInventoryField } from '../../../domain';
import { FoldersState } from '../folders';
import { RootState } from '../root.reducers';
import { selectFromRoot } from '../utils';

export const getFoldersState = (state: Partial<RootState>): FoldersState =>
  selectFromRoot(state, 'Folders')!;

export const getFolders = createSelector(getFoldersState, (folderState) =>
  maybe(folderState).mapTo('folders').valueOr([]),
);

export const getCollectableFolders = createSelector(getFolders, (folders) =>
  folders.filter((it) => it.id !== 0),
);

export const getFields = createSelector(
  getFoldersState,
  (discogs) =>
    maybe(discogs)
      .mapTo('fields')
      .map((it) => it.filter((field) => field.type === 'dropdown'))
      .valueOr([]) as DropdownInventoryField[],
);

const getSelectedAbleFields = createSelector(getFoldersState, (discogs) =>
  maybe(discogs)
    .mapTo('selectedFields')
    .valueOr({} as FoldersState['selectedFields']),
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
