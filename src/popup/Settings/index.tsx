import { ContentBody, DreadButton, Row, UglyButton } from '../styled'

import { FC } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Bin, Eye, Off } from '../../assets/icons'
import { HightlightedLabels } from '../../domain'
import { RootState } from '../../services/redux'
import { actions as appActions } from '../../services/redux/app'
import { actions as foldersActions } from '../../services/redux/folders'
import {
  DispatchProps,
  getHightlightedLabels,
  isSyncing,
  StateProps,
} from '../../services/redux/selectors'
import { DispatchAction } from '../../services/redux/store'
import { actions as wantListActions } from '../../services/redux/wantlist'
import { getTexts } from '../../services/texts'
import { colors, Submit } from '../styled'
import LabelsControlPanel from './highlighted.labels.control.panel'
import { Column } from './styled'

export interface Props {
  clearStorage: DispatchAction<void>
  syncWantList: DispatchAction<void>
  logOut: DispatchAction<void>
  isSyncing: boolean
  setHightlightedLabels: DispatchAction<HightlightedLabels>
  hightlightedLabels: HightlightedLabels
}

const Settings = ({
  clearStorage,
  syncWantList,
  isSyncing,
  logOut,
  hightlightedLabels,
  setHightlightedLabels,
}: Props) => {
  const [resyncBtn, resyncExplained, binBtn, binExplained, logOutTxt] =
    getTexts(
      'settings.resync.btn',
      'settings.resync.explained',
      'settings.clear.storage',
      'settings.clear.storage.explained',
      'log.out',
    )

  return (
    <ContentBody filled>
      <Row width={44}>
        <Column>
          <Submit disabled={isSyncing} onClick={() => syncWantList()}>
            <Eye {...{ fill: colors.bright }} />
            {resyncBtn}
          </Submit>
          <p>{resyncExplained}</p>
        </Column>

        <Column>
          <UglyButton disabled={isSyncing} onClick={() => clearStorage()}>
            <Bin />
            {binBtn}
          </UglyButton>
          <p>{binExplained}</p>
        </Column>
      </Row>
      <Row width={44} padding={[1, 0, 0]}>
        <Column>
          <DreadButton onClick={() => logOut()}>
            <Off />
            {logOutTxt}
          </DreadButton>
        </Column>
      </Row>
      <LabelsControlPanel {...{ hightlightedLabels, setHightlightedLabels }} />
    </ContentBody>
  )
}

export const mapStateToProps = (
  state: RootState,
): StateProps<Partial<Props>> => ({
  isSyncing: isSyncing(state),
  hightlightedLabels: getHightlightedLabels(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    syncWantList: bindActionCreators(wantListActions.syncWantList, dispatch),
    setHightlightedLabels: bindActionCreators(
      appActions.setHighglightedLabels,
      dispatch,
    ),
    clearStorage: bindActionCreators(
      foldersActions.clearSelectedFields,
      dispatch,
    ),
    logOut: bindActionCreators(appActions.logOut, dispatch),
  } as Props)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings as FC<Partial<Props>>)
