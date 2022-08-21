import { ContentBody, DreadButton, Row, UglyButton } from '../styled';

import { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Bin, Eye, Off } from '../../assets/icons';
import { HighlightedLabels } from '../../domain';
import { RootState } from '../../services/redux';
import { actions as appActions } from '../../services/redux/app';
import { actions as foldersActions } from '../../services/redux/folders';
import {
  DispatchProps,
  getHighlightedLabels,
  isSyncing,
  StateProps,
} from '../../services/redux/selectors';
import { DispatchAction } from '../../services/redux/store';
import { actions as wantListActions } from '../../services/redux/wantlist';
import { getTexts } from '../../services/texts';
import { discogsColors, Submit } from '../styled';
import LabelsControlPanel from './highlighted.labels.control.panel';
import { Column } from './styled';

export interface Props {
  clearStorage: DispatchAction<void>;
  syncWantList: DispatchAction<void>;
  logOut: DispatchAction<void>;
  isSyncing: boolean;
  setHighlightedLabels: DispatchAction<HighlightedLabels>;
  highlightedLabels: HighlightedLabels;
}

const Settings = ({
  clearStorage,
  syncWantList,
  isSyncing,
  logOut,
  highlightedLabels,
  setHighlightedLabels,
}: Props) => {
  const [resyncBtn, resyncExplained, binBtn, binExplained, logOutTxt] = getTexts(
    'settings.resync.btn',
    'settings.resync.explained',
    'settings.clear.storage',
    'settings.clear.storage.explained',
    'log.out',
  );

  return (
    <ContentBody filled>
      <Row>
        <Column>
          <Submit disabled={isSyncing} onClick={() => syncWantList()}>
            <Eye {...{ fill: discogsColors.white }} />
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

        <Column>
          <DreadButton onClick={() => logOut()}>
            <Off />
            {logOutTxt}
          </DreadButton>
        </Column>
      </Row>
      <LabelsControlPanel
        {...{
          highlightedLabels: highlightedLabels,
          setHighlightedLabels: setHighlightedLabels,
        }}
      />
    </ContentBody>
  );
};

export const mapStateToProps = (state: RootState): StateProps<Partial<Props>> => ({
  isSyncing: isSyncing(state),
  highlightedLabels: getHighlightedLabels(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    syncWantList: bindActionCreators(wantListActions.syncWantList, dispatch),
    setHighlightedLabels: bindActionCreators(appActions.setHighlightedLabels, dispatch),
    clearStorage: bindActionCreators(foldersActions.clearSelectedFields, dispatch),
    logOut: bindActionCreators(appActions.logOut, dispatch),
  } as Props);

export default connect(mapStateToProps, mapDispatchToProps)(Settings as FC<Partial<Props>>);
