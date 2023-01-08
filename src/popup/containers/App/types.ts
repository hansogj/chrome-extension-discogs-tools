import { Notification } from '../../../services/redux/app/';

import { View } from '../../../services/redux/app';

import { Props as ViewProps } from '../../components/View';

import { Async } from '../../../services/redux/domain';
import { HeaderProps, TokenInputProps } from '../../components/App';

export type SwitchedView = {
  view: View;
  isActive: boolean;
};

export interface AppProps
  extends TokenInputProps,
    ViewProps,
    Modify<
      HeaderProps,
      {
        user: Async.User;
      }
    > {
  activeView: View;
  notification: Notification;
}
