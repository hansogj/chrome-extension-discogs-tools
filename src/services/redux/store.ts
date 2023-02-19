import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import { MessageActionTypes } from '../message.handlers';
import { AppActionTypes } from './app';
import { DiscogsActionTypes } from './discogs';
import { FoldersActionTypes } from './folders';
import rootReducer from './root.reducers';
import rootSaga from './root.sagas';
import { UserActionTypes } from './user';
import { InventoryActionTypes } from './inventory';

const isProduction = false;
const sagaMiddleware = createSagaMiddleware();

export const store: Store = createStore(
  rootReducer,
  isProduction
    ? applyMiddleware(sagaMiddleware)
    : composeWithDevTools(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(rootSaga);

export type ActionTypes =
  | DiscogsActionTypes
  | AppActionTypes
  | MessageActionTypes
  | InventoryActionTypes
  | FoldersActionTypes
  | UserActionTypes;

export const action = (type: ActionTypes): ActionTypes => store.dispatch(type);

export type DispatchAction<T> = Fn<[T], ActionTypes>;
