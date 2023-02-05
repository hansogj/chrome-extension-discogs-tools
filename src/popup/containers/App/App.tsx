import { FC, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../services/redux';

import { actions as appActions, selectors as appSelectors } from '../../../services/redux/app/';
import { DispatchProps, StateProps } from '../../../services/redux/selectors/utils';
import View from '../../components/View';
import { Container, Content } from '../../styled';

import {
  Header,
  Loader,
  Notification as NotificationComponent,
  TokenInput,
} from '../../components/App';
import { getActiveView, getAvailableViews } from './selectors';
import { AppProps } from './types';
import { actions as userActions, selectors as userSelectors } from '../../../services/redux/user';
export const App = ({
  notification,
  setUserToken,
  user: asyncUser,
  activeView,
  ...headerProps
}: AppProps) => {
  let ref = useRef(null);

  return (
    <Container id="container">
      <Content id="content" ref={ref}>
        {notification && <NotificationComponent {...{ refObject: ref, notification }} />}
        {asyncUser.match({
          NotAsked: () => <TokenInput setUserToken={setUserToken} />,
          Loading: () => <Loader />,
          Done: (loadedUser) =>
            loadedUser.match({
              Ok: (user) => (
                <div data-test-main-content>
                  <Header {...{ ...headerProps, user }} />
                  <View {...{ activeView }} />
                </div>
              ),
              Error: () => <TokenInput setUserToken={setUserToken} />,
            }),
        })}
      </Content>
    </Container>
  );
};

export const mapStateToProps = (state: RootState): StateProps<Partial<AppProps>> => ({
  user: userSelectors.getAsyncUser(state),
  notification: appSelectors.getNotification(state),
  views: getAvailableViews(state),
  activeView: getActiveView(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<AppProps> =>
  ({
    setUserToken: bindActionCreators(userActions.setUserToken, dispatch),
    setView: bindActionCreators(appActions.setView, dispatch),
  } as AppProps);

export default connect(mapStateToProps, mapDispatchToProps)(App as FC<Partial<AppProps>>);
