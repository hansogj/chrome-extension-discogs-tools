import maybe from "maybe-for-sure";
import { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import record from "../../assets/round-record.png";
import { User } from "../../domain";
import { RootState } from "../../redux";
import { actions as appActions, Notification } from "../../redux/app/";
import {
  getNotification,
  getUser,
  isLoading,
  notAuthenticated,
} from "../../redux/selectors/app.selectors";
import { DispatchProps, StateProps } from "../../redux/selectors/utils";
import { getText } from "../../services/texts";
import View from "../View";
import { Container, Content } from "../styled";
import NotificationComponent from "./Notification";
import Profile, { Props as ProfileProps } from "./Profile";
import { AppLogo, ContentHeader } from "./style";
import TokenInput, { TokenInputProps } from "./TokenInput";

interface AppProps extends TokenInputProps, ProfileProps, LoaderProps {
  notification: Notification;
  user: Optional<User>;
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
}: AppProps) => {
  let ref = useRef(null);

  console.log(
    JSON.stringify({
      isLoading: maybe(isLoading).nothingUnless(Boolean).valueOr("*"),
      notAuthenticated: maybe(notAuthenticated)
        .nothingUnless(Boolean)
        .valueOr("*"),
      user: maybe(user as any)
        .nothingUnless(Boolean)
        .map(() => "user")
        .valueOr("*"),
    })
  );

  return (
    <Container id="container">
      <Content id="content" ref={ref}>
        <>
          {maybe(isLoading)
            .nothingUnless(Boolean)
            .map(() => <Loader {...{ getUser }} />)
            .or(
              maybe(notAuthenticated)
                .nothingUnless(Boolean)
                .map(() => <TokenInput setUserToken={setUserToken} />)
            )
            .or(
              maybe(user as any)
                .nothingUnless(Boolean)
                .map(() => (
                  <>
                    <Profile {...{ user }} />
                    {notification && (
                      <NotificationComponent
                        {...{
                          refObject: ref,
                          notification,
                        }}
                      />
                    )}
                    <View />
                  </>
                ))
            )

            .valueOr(
              <NotificationComponent
                {...{
                  notification: {
                    message: getText("notification.general.error"),
                    isError: true,
                  },
                }}
              />
            )}
        </>
      </Content>
    </Container>
  );
};

export const mapStateToProps = (
  state: RootState
): StateProps<Partial<AppProps>> => ({
  user: getUser(state),
  isLoading: isLoading(state),
  notAuthenticated: notAuthenticated(state),
  notification: getNotification(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<AppProps> =>
  ({
    getUser: bindActionCreators(appActions.getUser, dispatch),

    setUserToken: bindActionCreators(appActions.setUserToken, dispatch),
  } as AppProps);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App as FC<Partial<AppProps>>);
