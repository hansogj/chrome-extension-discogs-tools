import { HighlightedLabels } from '../../../domain';
import { ActionTypes as AnyActionTypes } from '../store';
import { ActionDataTypes } from '../types';
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

export type AppActionData = Mutable<AppState> & {
  url: Optional<string>;
};

export enum AppActions {
  APP_NOTIFY = 'APP_NOTIFY',
  APP_ERROR = 'APP_ERROR',
  APP_NOTIFY_RESET = 'APP_NOTIFY_RESET',
  APP_SET_VIEW = 'APP_SET_VIEW',
  APP_SET_VIEW_SUCCESS = 'APP_SET_VIEW_SUCCESS',
  APP_GO_TO_URL = 'APP_GO_TO_URL',
  APP_WINDOW_URL_RETRIEVED = 'WINDOW_URL_RETRIEVED',
  APP_SET_HIGHLIGHTED_LABELS = 'APP_SET_HIGHLIGHTED_LABELS',
  APP_SET_HIGHLIGHTED_LABELS_SUCCESS = 'APP_SET_HIGHLIGHTED_LABELS_SUCCESS',
  APP_GET_HIGHLIGHTED_LABELS_SUCCESS = 'APP_GET_HIGHLIGHTED_LABELS_SUCCESS',
  APP_CLEAR_STORAGE = 'APP_CLEAR_STORAGE',
}

export type AppActionTypes = ActionDataTypes<AppActions, AppActionData>;
