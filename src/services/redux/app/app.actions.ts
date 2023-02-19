import maybe from '@hansogj/maybe';
import { toAction } from '../utils';
import { AppActionData, AppActions, AppActionTypes, Notification } from './types';

// prettier-ignore
const { APP_NOTIFY, APP_ERROR, APP_NOTIFY_RESET, APP_SET_VIEW, APP_SET_VIEW_SUCCESS, APP_GO_TO_URL, APP_WINDOW_URL_RETRIEVED: WINDOW_URL_RETRIEVED, APP_SET_HIGHLIGHTED_LABELS, APP_SET_HIGHLIGHTED_LABELS_SUCCESS, APP_GET_HIGHLIGHTED_LABELS_SUCCESS, APP_CLEAR_STORAGE, } = AppActions;

const toAppAction =
  (type: AppActions) =>
  (data: Partial<AppActionData> = {}) =>
    toAction<AppActions, Partial<AppActionData>>(type, data);

export const error = toAppAction(APP_ERROR);
export const windowUrlRetrieved = toAppAction(WINDOW_URL_RETRIEVED);
export const notifyReset = toAppAction(APP_NOTIFY_RESET);
export const setView = toAppAction(APP_SET_VIEW);
export const setViewSuccess = toAppAction(APP_SET_VIEW_SUCCESS);
export const goToUrl = toAppAction(APP_GO_TO_URL);
export const setHighlightedLabels = toAppAction(APP_SET_HIGHLIGHTED_LABELS);
export const setHighlightedLabelsSuccess = toAppAction(APP_SET_HIGHLIGHTED_LABELS_SUCCESS);
export const getHighlightedLabelsSuccess = toAppAction(APP_GET_HIGHLIGHTED_LABELS_SUCCESS);

export const warn = ({ message, error, actionBtn }: Partial<Notification>): AppActionTypes => ({
  type: APP_NOTIFY,
  notification: {
    message: maybe(message)
      .or(maybe(error as Error).mapTo('message'))
      .valueOr(JSON.stringify(error)),
    error,
    actionBtn,
    isError: true,
  },
});

export const notify = ({
  message,
  actionBtn,
}: Pick<Notification, 'message' | 'actionBtn'>): AppActionTypes => ({
  type: APP_NOTIFY,
  notification: { message, actionBtn, isError: false },
});

export const clearStorage = () => ({ type: APP_CLEAR_STORAGE });
