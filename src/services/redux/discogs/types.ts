import { Instance, ReleasePageItem } from '../../../domain';
import { ActionTypes } from '../types';

export interface DiscogsState {
  readonly releasePageItem: Optional<ReleasePageItem>;
}

export interface DiscogsActionData {
  instance: Optional<Instance>;
  releasePageItem: Optional<ReleasePageItem>;
}

export enum DiscogsActions {
  getReleasePageItem = 'GET_RELEASE_PAGE_ITEM',
  getReleasePageItemSuccess = 'GET_RELEASE_PAGE_ITEM_SUCCESS',
  domGoTo = 'DOM_GO_TO',
  domFilterSellers = 'DOM_FILTER_SELLERS',
  domFilterReleases = 'DOM_FILTER_RELEASES',
}

export type DiscogsActionTypes = ActionTypes<DiscogsActions, DiscogsActionData>;
