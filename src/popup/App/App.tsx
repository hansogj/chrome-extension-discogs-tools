import maybe from '@hansogj/maybe';
import { FC, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import record from '../../assets/round-record.png';
import { RootState } from '../../services/redux';
import { actions as appActions, Notification } from '../../services/redux/app/';

import {
  getActiveView,
  getNotification,
  getUser,
  getWindowUrlMatch,
  hasArtistReleases,
  hasReleasePageItem,
  isLoading,
  notAuthenticated,
} from '../../services/redux/selectors';
import { DispatchProps, StateProps } from '../../services/redux/selectors/utils';
import { Container, Content } from '../styled';
import View, { Props as ViewProps } from '../View';
import Header, { Props as HeaderProps } from './Header';
import NotificationComponent from './Notification';
import { AppLogo, ContentHeader } from './style';
import TokenInput, { TokenInputProps } from './TokenInput';

interface AppProps extends TokenInputProps, LoaderProps, ViewProps, HeaderProps {
  notification: Notification;
  isLoading: boolean;
  notAuthenticated: boolean;
}

type LoaderProps = { getUser: typeof appActions.getUser };
const Loader: FC<LoaderProps> = ({ getUser }: LoaderProps) => {
  useEffect(() => {
    getUser();
  }, [getUser]);
  return (
    <ContentHeader>
      <AppLogo src={record} alt="logo" />
    </ContentHeader>
  );
};

const App: FC<AppProps> = ({
  user,
  notification,
  setUserToken,
  isLoading,
  notAuthenticated,
  getUser,
  activeView,
  setView,
  hasReleaseItems,
  hasArtistReleases,
}: AppProps) => {
  let ref = useRef(null);

  return (
    <Container id="container">
      <Content id="content" ref={ref}>
        {maybe(isLoading)
          .nothingUnless(Boolean)
          .map(() => <Loader {...{ getUser }} />)
          .or(
            maybe(notAuthenticated)
              .nothingUnless(Boolean)
              .map(() => <TokenInput setUserToken={setUserToken} />),
          )
          .or(
            maybe(user as any)
              .nothingUnless(Boolean)
              .map(() => (
                <>
                  {notification && (
                    <NotificationComponent
                      {...{
                        refObject: ref,
                        notification,
                      }}
                    />
                  )}
                  <Header
                    {...{
                      activeView,
                      setView,
                      user,

                      hasArtistReleases,
                      hasReleaseItems,
                    }}
                  />
                  <View {...{ activeView }} />
                </>
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
  activeView: getActiveView(state),
  hasArtistReleases: hasArtistReleases(state),
  hasReleaseItems: hasReleasePageItem(state),
  //  getUrlMatch: getWindowUrlMatch(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<AppProps> =>
  ({
    getUser: bindActionCreators(appActions.getUser, dispatch),
    setUserToken: bindActionCreators(appActions.setUserToken, dispatch),
    setView: bindActionCreators(appActions.setView, dispatch),
  } as AppProps);

export default connect(mapStateToProps, mapDispatchToProps)(App as FC<Partial<AppProps>>);
