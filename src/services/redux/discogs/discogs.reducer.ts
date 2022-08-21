import { reducerForProducers, writeToDraft } from '../utils';
import { DiscogsActions, DiscogsActionTypes, DiscogsState } from './types';

export const initialState: DiscogsState = {
  releasePageItem: undefined,
};

const discogsReducer = reducerForProducers<DiscogsState, DiscogsActionTypes, DiscogsActions>(
  initialState,
  {
    GET_RELEASE_PAGE_ITEM_SUCCESS: writeToDraft('releasePageItem'),
  },
);

export default discogsReducer;
