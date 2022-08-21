import * as actions from './folders.actions';
import reducer, { initialState } from './folders.reducer';
import * as sagas from './folders.saga';

export * from './types';
export { actions, reducer, initialState, sagas };
