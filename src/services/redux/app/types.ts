import { AsyncData } from '@swan-io/boxed';
import { HighlightedLabels, User } from '../../../domain';
import { Async } from '../domain';
import { ActionTypes as AnyActionTypes } from '../store';
import { ActionTypes } from '../types';
export const DISCOGS_BASE_URL = 'https://api.discogs.com';

export const Views = ['Artist', 'Item', 'Settings', 'Want List'] as const;
export type View = typeof Views[number];

export type ActionButton = { action: AnyActionTypes; text: string };
export const MustHaveReleaseItem: View[] = ['Item'];
export const MustHaveArtistReleases: View[] = ['Artist'];
export type ErrorType = ERROR | Error | string;

export type Notification = {
  message: string;
  actionBtn?: ActionButton;
  isError: boolean;
  error?: ErrorType;
};

export interface AppState {
  readonly user: Async.User;
  readonly error: Optional<ErrorType>;
  readonly notification: Optional<Notification>;
  readonly isLoading: boolean;
  readonly view: Optional<View>;
  readonly windowUrl: Optional<URL>;
  readonly highlightedLabels: Optional<HighlightedLabels>;
}

export enum ERROR {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  NO_TAB_TO_CAPTURE = 'NO_TAB_TO_CAPTURE',
}

export interface AppActionData {
  identity: Optional<string>;
  error: Optional<ErrorType>;
  user: Async.User;
  userToken: Optional<string>;
  notification: Notification;
  view: Optional<View>;
  highlightedLabels: Optional<HighlightedLabels>;
  windowUrl: Optional<URL>;
  url: Optional<string>;
}

export enum AppActions {
  notify = 'APP_NOTIFY',
  error = 'APP_ERROR',
  notifyReset = 'APP_NOTIFY_RESET',
  getIdentity = 'GET_IDENTITY',
  getIdentitySuccess = 'GET_IDENTITY_SUCCESS',
  getUserInit = 'GET_USER_INIT',
  getUser = 'GET_USER',

  setUserToken = 'SET_USER_TOKEN',
  setUserTokenSuccess = 'SET_USER_TOKEN_SUCCESS',
  logOut = 'APP_LOG_OUT',
  setView = 'APP_SET_VIEW',
  setViewSuccess = 'APP_SET_VIEW_SUCCESS',
  goToUrl = 'APP_GO_TO_URL',
  windowUrlRetrieved = 'WINDOW_URL_RETRIEVED',
  setHighlightedLabels = 'APP_SET_HIGHLIGHTED_LABELS',
  setHighlightedLabelsSuccess = 'APP_SET_HIGHLIGHTED_LABELS_SUCCESS',
  getHighlightedLabelsSuccess = 'APP_GET_HIGHLIGHTED_LABELS_SUCCESS',
  clearStorage = 'APP_CLEAR_STORAGE',
}

export type AppActionTypes = ActionTypes<AppActions, AppActionData>;
