import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import createSagaMiddleware from 'redux-saga'
import { MessageActionTypes } from '../message.handlers'
import { DiscogsActionTypes } from './discogs'
import { WantListActionTypes } from './wantlist'
import { AppActionTypes } from './app'
import { FoldersActionTypes } from './folders'
import rootReducer from './root.reducers'
import rootSaga from './root.sagas'

const isProduction = false
const sagaMiddleware = createSagaMiddleware()

export const store: Store = createStore(
  rootReducer,
  isProduction
    ? applyMiddleware(sagaMiddleware)
    : composeWithDevTools(applyMiddleware(sagaMiddleware)),
)
sagaMiddleware.run(rootSaga)

export type ActionTypes =
  | DiscogsActionTypes
  | AppActionTypes
  | MessageActionTypes
  | WantListActionTypes
  | FoldersActionTypes

export const action = (type: ActionTypes): ActionTypes => store.dispatch(type)

export type DispatchAction<T> = Fn<[T], ActionTypes>
