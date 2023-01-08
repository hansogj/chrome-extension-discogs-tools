import maybe from '@hansogj/maybe';
import { AsyncData } from '@swan-io/boxed';
import { HighlightedLabels, User } from '../../../domain';
import { Async } from '../domain';
import { AppActions, AppActionTypes, ERROR, Notification, View } from './types';

export const error = (error: ERROR) => ({
  type: AppActions.error,
  error,
});

export const windowUrlRetrieved = (url: URL): AppActionTypes => ({
  type: AppActions.windowUrlRetrieved,
  windowUrl: url,
});

export const warn = ({ message, error, actionBtn }: Partial<Notification>): AppActionTypes => ({
  type: AppActions.notify,
  notification: {
    message: maybe(message)
      .or(maybe(error as Error).mapTo('message'))
      .valueOr(JSON.stringify(error)),
    error,
    actionBtn,
    isError: true,
  },
});

export const notifyReset = (): AppActionTypes => ({
  type: AppActions.notifyReset,
});

export const notify = ({
  message,
  actionBtn,
}: Pick<Notification, 'message' | 'actionBtn'>): AppActionTypes => ({
  type: AppActions.notify,
  notification: { message, actionBtn, isError: false },
});

export const getUserInit = (): AppActionTypes => ({
  type: AppActions.getUserInit,
});

export const getUser = (user: Async.User): AppActionTypes => ({
  type: AppActions.getUser,
  user,
});

export const logOut = (): AppActionTypes => ({
  type: AppActions.logOut,
  user: AsyncData.NotAsked(),
});

export const setUserToken = (userToken: string): AppActionTypes => ({
  type: AppActions.setUserToken,
  userToken,
});

export const setUserTokenSuccess = (): AppActionTypes => ({
  type: AppActions.setUserTokenSuccess,
});

export const getIdentity = (): AppActionTypes => ({
  type: AppActions.getIdentity,
});

export const getIdentitySuccess = (identity: string): AppActionTypes => ({
  type: AppActions.getIdentitySuccess,
  identity,
});

export const setView = (view: View): AppActionTypes => ({
  type: AppActions.setView,
  view,
});

export const setViewSuccess = (view?: View): AppActionTypes => ({
  type: AppActions.setViewSuccess,
  view,
});

export const goToUrl = (url: string): AppActionTypes => ({
  type: AppActions.goToUrl,
  url,
});

export const setHighlightedLabels = (highlightedLabels: HighlightedLabels): AppActionTypes => ({
  type: AppActions.setHighlightedLabels,
  highlightedLabels,
});

export const setHighlightedLabelsSuccess = (
  highlightedLabels: HighlightedLabels,
): AppActionTypes => ({
  type: AppActions.setHighlightedLabelsSuccess,
  highlightedLabels,
});

export const getHighlightedLabelsSuccess = (
  highlightedLabels: HighlightedLabels,
): AppActionTypes => ({
  type: AppActions.getHighlightedLabelsSuccess,
  highlightedLabels,
});
export const clearStorage = () => ({ type: AppActions.clearStorage });
