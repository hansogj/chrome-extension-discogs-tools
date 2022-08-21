import maybe from 'maybe-for-sure';
import { createSelector } from 'reselect';
import { getFoldersState, getReleasePageItem } from '../../services/redux/selectors';

export const disableSubmitBtn = createSelector(
  getFoldersState,
  getReleasePageItem,
  (folderState, releasePageItem) =>
    Boolean(
      maybe(folderState).mapTo('addingToFolder').valueOr(false) ||
        maybe(releasePageItem).mapTo('releaseId').isNothing(),
    ),
);
