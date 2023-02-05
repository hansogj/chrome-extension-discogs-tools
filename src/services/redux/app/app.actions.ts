import maybe from '@hansogj/maybe';
import { HighlightedLabels } from '../../../domain';
import { AppActions, AppActionTypes, ErrorType, Notification, View } from './types';

export const error = (error: ErrorType) => ({
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
