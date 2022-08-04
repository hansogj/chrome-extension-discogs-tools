import { FC } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { RootState } from '../services/redux'
import { actions as appActions } from '../services/redux/app'
import {
  DispatchProps,
  getActiveView,
  getReleasePageItem,
  StateProps,
} from '../services/redux/selectors'
import AddToFolder from './Discogs/AddToFolder'
import AddWantList from './Discogs/AddWantList'
import WantListComponent from './Discogs/WantList'
import { ContentBody } from './styled'
import ViewSelector, { Props as ViewSelectorProps } from './ViewSelector'

import { Props as ReleasePageItemProps } from './Discogs/ReleasePageItem'
import Settings from './Settings'

interface ViewProps extends ReleasePageItemProps, ViewSelectorProps {}

const DiscogsContainer: FC<ViewProps> = ({
  releasePageItem,
  activeView,
  setView,
}: ViewProps) => (
  <ContentBody>
    <ViewSelector
      {...{ activeView, setView, hasReleasePageItem: !!releasePageItem }}
    />
    {activeView === 'Watch' && <AddWantList />}
    {activeView === 'Want List' && <WantListComponent />}
    {activeView === 'Add Item' && <AddToFolder />}
    {activeView === 'Settings' && <Settings />}
  </ContentBody>
)

export const mapStateToProps = (
  state: RootState,
): StateProps<Partial<ViewProps>> => ({
  releasePageItem: getReleasePageItem(state),
  activeView: getActiveView(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<ViewProps> =>
  ({
    setView: bindActionCreators(appActions.setView, dispatch),
  } as ViewProps)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DiscogsContainer as FC<Partial<ViewProps>>)
