import maybe from 'maybe-for-sure'
import { FC, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import record from '../../assets/round-record.png'
import { User } from '../../domain'
import { RootState } from '../../services/redux'
import { actions as appActions, Notification } from '../../services/redux/app/'
import {
  getNotification,
  getUser,
  isLoading,
  notAuthenticated,
} from '../../services/redux/selectors/app.selectors'
import { DispatchProps, StateProps } from '../../services/redux/selectors/utils'
import { Container, Content } from '../styled'
import View from '../View'
import NotificationComponent from './Notification'
import Profile, { Props as ProfileProps } from './Profile'
import { AppLogo, ContentHeader } from './style'
import TokenInput, { TokenInputProps } from './TokenInput'

interface AppProps extends TokenInputProps, ProfileProps, LoaderProps {
  notification: Notification
  user: Optional<User>
  isLoading: boolean
  notAuthenticated: boolean
}

type LoaderProps = { getUser: typeof appActions.getUser }
const Loader: FC<LoaderProps> = ({ getUser }: LoaderProps) => {
  useEffect(() => {
    getUser()
  }, [getUser])
  return (
    <ContentHeader>
      <AppLogo src={record} alt="logo" />
    </ContentHeader>
  )
}

const App: FC<AppProps> = ({
  user,
  notification,
  setUserToken,
  isLoading,
  notAuthenticated,
  getUser,
}: AppProps) => {
  let ref = useRef(null)

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
                .map(() => <TokenInput setUserToken={setUserToken} />),
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
                )),
            )

            .valueOr(<TokenInput setUserToken={setUserToken} />)}
        </>
      </Content>
    </Container>
  )
}

export const mapStateToProps = (
  state: RootState,
): StateProps<Partial<AppProps>> => ({
  user: getUser(state),
  isLoading: isLoading(state),
  notAuthenticated: notAuthenticated(state),
  notification: getNotification(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<AppProps> =>
  ({
    getUser: bindActionCreators(appActions.getUser, dispatch),
    setUserToken: bindActionCreators(appActions.setUserToken, dispatch),
  } as AppProps)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App as FC<Partial<AppProps>>)
