import * as actions from './discogs.actions';
import reducer, { initialState } from './discogs.reducer';
import * as sagas from './discogs.saga';

export * from './types';
export { actions, reducer, initialState, sagas };
