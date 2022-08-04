import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import ReleasePageItem, {
  Props as ReleasePageItemProps,
} from '../ReleasePageItem'

import { FC } from 'react'
import { RootState } from '../../../services/redux'
import {
  DispatchProps,
  getReleasePageItem,
  StateProps,
} from '../../../services/redux/selectors'
import { actions as wantListActions } from '../../../services/redux/wantlist'
import AddWantListComponent, {
  Props as AddWantListComponentProps,
} from './AddWantListComponent'

export interface Props
  extends ReleasePageItemProps,
    AddWantListComponentProps {}

const AddWantList = ({ releasePageItem, addToWantList }: Props) => (
  <ReleasePageItem releasePageItem={releasePageItem}>
    <AddWantListComponent {...{ addToWantList }} />
  </ReleasePageItem>
)

export const mapStateToProps = (
  state: RootState,
): StateProps<Partial<Props>> => ({
  releasePageItem: getReleasePageItem(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    addToWantList: bindActionCreators(wantListActions.addToWantList, dispatch),
  } as Props)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddWantList as FC<Partial<Props>>)
