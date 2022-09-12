import { reducerForProducers, writeToDraft } from '../utils';
import { DiscogsActions, DiscogsActionTypes, DiscogsState } from './types';

export const initialState: DiscogsState = {
  releasePageItem: undefined,
  artistReleases: undefined,
  artist: undefined,
};

const discogsReducer = reducerForProducers<DiscogsState, DiscogsActionTypes, DiscogsActions>(
  initialState,
  {
    GET_RELEASE_PAGE_ITEM_LOADED: writeToDraft('releasePageItem'),
    GET_ARTIST_RELEASES_LOADED: (draft, { artist, artistReleases }) => {
      draft.artist = artist;
      draft.artistReleases = artistReleases;
    },
  },
);

export default discogsReducer;
