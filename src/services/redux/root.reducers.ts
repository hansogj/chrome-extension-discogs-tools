import { combineReducers } from 'redux';

import { reducer as Discogs } from './discogs';
import { reducer as App } from './app';
import { reducer as WantList } from './wantlist';
import { reducer as Folders } from './folders';

const rootReducer = combineReducers({
  Discogs,
  App,
  WantList,
  Folders,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
