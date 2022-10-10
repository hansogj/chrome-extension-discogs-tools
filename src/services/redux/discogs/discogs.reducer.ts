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
    [DiscogsActions.getReleasePageItemLoaded]: writeToDraft('releasePageItem'),
    [DiscogsActions.getArtistLoadedSuccess]: writeToDraft('artist'),
    [DiscogsActions.getArtistReleasesLoaded]: (draft, { artist, artistReleases }) => {
      draft.artist = artist;
      draft.artistReleases = artistReleases;
    },
  },
);

export default discogsReducer;
