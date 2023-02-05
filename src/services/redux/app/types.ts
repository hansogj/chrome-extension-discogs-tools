import { HighlightedLabels } from '../../../domain';
import { ActionTypes as AnyActionTypes } from '../store';
import { ActionTypes } from '../types';
import { USER_ERROR } from '../user';

export const Views = ['Artist', 'Item', 'Settings', 'Want List'] as const;
export type View = typeof Views[number];

export type ActionButton = { action: AnyActionTypes; text: string };
export const MustHaveReleaseItem: View[] = ['Item'];
export const MustHaveArtistReleases: View[] = ['Artist'];
export type ErrorType = USER_ERROR | ERROR | Error | string;

export type Notification = {
  message: string;
  actionBtn?: ActionButton;
  isError: boolean;
  error?: ErrorType;
};

export const resourceMatchers = {
  releases: /\/release\//,
  masters: /\/master\//,
  artists: /\/artist\//,
};

export type ResourceMatcher = Record<keyof typeof resourceMatchers, number>;

export interface AppState {
  readonly error: Optional<ErrorType>;
  readonly notification: Optional<Notification>;
  readonly isLoading: boolean;
  readonly view: Optional<View>;
  readonly windowUrl: Optional<URL>;
  readonly highlightedLabels: Optional<HighlightedLabels>;
}

export enum ERROR {
  NO_TAB_TO_CAPTURE = 'NO_TAB_TO_CAPTURE',
}

export interface AppActionData {
  error: Optional<ErrorType>;
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
