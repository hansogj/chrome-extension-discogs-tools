import maybe from "maybe-for-sure";
import { HightlightedLabels, User } from "../../domain";
import { AppActions, AppActionTypes, ERROR, Notification, View } from "./types";

export const error = (error: ERROR) => ({
  type: AppActions.error,
  error,
});

export const warn = ({
  message,
  error,
  actionBtn,
}: Partial<Notification>): AppActionTypes => ({
  type: AppActions.notify,
  notification: {
    message: maybe(message)
      .or(maybe(error as Error).mapTo("message"))
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
}: Pick<Notification, "message" | "actionBtn">): AppActionTypes => ({
  type: AppActions.notify,
  notification: { message, actionBtn, isError: false },
});

export const getUser = (): AppActionTypes => ({
  type: AppActions.getUser,
});

export const getUserSuccess = (user: User): AppActionTypes => ({
  type: AppActions.getUserSuccess,
  user,
});

export const logOut = (): AppActionTypes => ({
  type: AppActions.logOut,
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

export const setViewSuccess = (view: View): AppActionTypes => ({
  type: AppActions.setViewSuccess,
  view,
});

export const goToUrl = (url: string): AppActionTypes => ({
  type: AppActions.goToUrl,
  url,
});

export const setHighglightedLabels = (
  highlightedLabels: HightlightedLabels
): AppActionTypes => ({
  type: AppActions.setHighglightedLabels,
  highlightedLabels,
});

export const setHighglightedLabelsSuccess = (
  highlightedLabels: HightlightedLabels
): AppActionTypes => ({
  type: AppActions.setHighglightedLabelsSuccess,
  highlightedLabels,
});

export const getHighglightedLabelsSuccess = (
  highlightedLabels: HightlightedLabels
): AppActionTypes => ({
  type: AppActions.getHighglightedLabelsSuccess,
  highlightedLabels,
});
