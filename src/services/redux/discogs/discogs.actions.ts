import { Instance, ReleasePageItem } from '../../../domain';
import { DiscogsActions, DiscogsActionTypes } from './types';

export const getReleasePageItem = (): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItem,
});

export const getReleasePageItemSuccess = (
  releasePageItem: ReleasePageItem,
): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItemSuccess,
  releasePageItem,
});

export const addToFolderSuccess = (instance: Instance): DiscogsActionTypes => ({
  type: DiscogsActions.getReleasePageItem,
  instance,
});
