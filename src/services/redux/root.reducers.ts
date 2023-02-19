import { combineReducers } from 'redux';

import { reducer as Discogs } from './discogs';
import { reducer as App } from './app';
import { reducer as Inventory } from './inventory';
import { reducer as Folders } from './folders';
import { reducer as User } from './user';

const rootReducer = combineReducers({
  Discogs,
  App,
  Inventory,
  Folders,
  User,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
