import maybe from '@hansogj/maybe';
import { FC, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../services/redux';
import { actions as appActions } from '../../../services/redux/app/';

import { getNotification, getUser, isLoading, notAuthenticated } from '../../../services/redux/app';

import { DispatchProps, StateProps } from '../../../services/redux/selectors/utils';
import { Container, Content } from '../../styled';
import View from '../../components/View';

import {
  Header,
  Loader,
  Notification as NotificationComponent,
  TokenInput,
} from '../../components/App';
import { getActiveView, getAvailableViews } from './selectors';
import { AppProps } from './types';

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
  views: getAvailableViews(state),
  activeView: getActiveView(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<AppProps> =>
  ({
    getUser: bindActionCreators(appActions.getUser, dispatch),
    setUserToken: bindActionCreators(appActions.setUserToken, dispatch),
    setView: bindActionCreators(appActions.setView, dispatch),
  } as AppProps);

export default connect(mapStateToProps, mapDispatchToProps)(App as FC<Partial<AppProps>>);
