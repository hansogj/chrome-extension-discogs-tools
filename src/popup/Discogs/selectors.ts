import maybe from '@hansogj/maybe';
import { createSelector } from 'reselect';
import { Release, ReleasePageItem } from '../../domain';
import { getFoldersState, getReleasePageItem } from '../../services/redux/selectors';
import { empty } from '../../services/utils/json.utils';

export const isMasterRelease = (releasePageItem: Optional<ReleasePageItem>) =>
  maybe(releasePageItem)
    .pick('releaseId', 'master')
    .nothingIf(empty)
    .map(
      ({ releaseId, master }) =>
        Boolean(releaseId) && releaseId === (master as Release.MasterReleaseDTO)?.id,
    )
    .valueOr(false);

export const disableSubmitBtn = createSelector(
  getFoldersState,
  getReleasePageItem,
  (folderState, releasePageItem) =>
    Boolean(
      maybe(folderState).mapTo('addingToFolder').valueOr(false) ||
        maybe(releasePageItem).mapTo('releaseId').isNothing() ||
        (isMasterRelease(releasePageItem) &&
          maybe(releasePageItem)
            .mapTo('master')
            .mapTo('resource_url')
            .nothingIf((it) => /release/.test(it))
            .valueOr(false)),
    ),
);
