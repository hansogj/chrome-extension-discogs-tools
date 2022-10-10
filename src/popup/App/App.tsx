import maybe from '@hansogj/maybe';
import { FC, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../services/redux';
import { actions as appActions, Notification } from '../../services/redux/app/';

import { View as ViewType } from '../../services/redux/app';
import {
  getActiveView,
  getNotification,
  getUser,
  getViews,
  isLoading,
  notAuthenticated,
} from '../../services/redux/selectors';
import { DispatchProps, StateProps } from '../../services/redux/selectors/utils';
import { Container, Content } from '../styled';
import View, { Props as ViewProps } from '../View';
import Header, { Props as HeaderProps } from './Header';
import Loader from './Loader';
import NotificationComponent from './Notification';
import TokenInput, { TokenInputProps } from './TokenInput';

export interface AppProps extends TokenInputProps, ViewProps, HeaderProps {
  activeView: ViewType;
  notification: Notification;
  isLoading: boolean;
  notAuthenticated: boolean;
  getUser: typeof appActions.getUser;
}

export const App: FC<AppProps> = ({
  notification,
  setUserToken,
  isLoading,
  notAuthenticated,
  getUser,
  activeView,
  ...headerProps
}: AppProps) => {
  let ref = useRef(null);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <Container id="container">
      <Content id="content" ref={ref}>
        {maybe(isLoading)
          .nothingUnless(Boolean)
          .map(() => <Loader />)
          .or(
            maybe(notAuthenticated)
              .nothingUnless(Boolean)
              .map(() => <TokenInput setUserToken={setUserToken} />),
          )
          .or(
            maybe(headerProps)
              .mapTo('user')
              .nothingUnless(Boolean)
              .map(() => (
                <div data-test-main-content>
                  {notification && <NotificationComponent {...{ refObject: ref, notification }} />}
                  <Header {...headerProps} />
                  <View {...{ activeView }} />
                </div>
              )),
          )
          .valueOr(<TokenInput setUserToken={setUserToken} />)}
      </Content>
    </Container>
  );
};

export const mapStateToProps = (state: RootState): StateProps<Partial<AppProps>> => ({
  user: getUser(state),
  isLoading: isLoading(state),
  notAuthenticated: notAuthenticated(state),
  notification: getNotification(state),
  views: getViews(state),
  activeView: getActiveView(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<AppProps> =>
  ({
    getUser: bindActionCreators(appActions.getUser, dispatch),
    setUserToken: bindActionCreators(appActions.setUserToken, dispatch),
    setView: bindActionCreators(appActions.setView, dispatch),
  } as AppProps);

export default connect(mapStateToProps, mapDispatchToProps)(App as FC<Partial<AppProps>>);
