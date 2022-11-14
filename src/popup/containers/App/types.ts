import { actions as appActions, Notification } from '../../../services/redux/app/';

import { View } from '../../../services/redux/app';

import { Props as ViewProps } from '../../components/View';

import { HeaderProps, TokenInputProps } from '../../components/App';

export type SwitchedView = {
  view: View;
  isActive: boolean;
};

export interface AppProps extends TokenInputProps, ViewProps, HeaderProps {
  activeView: View;
  notification: Notification;
  isLoading: boolean;
  notAuthenticated: boolean;
  getUser: typeof appActions.getUser;
}
