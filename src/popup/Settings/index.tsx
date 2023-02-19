import { ContentBody, DreadButton, Row, UglyButton } from '../styled';

import { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Bin, Collection, Eye, Off } from '../../assets/icons';
import { RootState } from '../../services/redux';
import { actions as appActions, selectors as appSelectors } from '../../services/redux/app';
import { actions as userActions } from '../../services/redux/user';

import { DispatchProps, StateProps } from '../../services/redux/selectors/utils';
import { DispatchAction } from '../../services/redux/store';
import {
  actions as wantListActions,
  getInventory,
  isSyncing,
} from '../../services/redux/inventory';
import { getTexts, renderText } from '../../services/texts';
import { discogsColors, Submit } from '../styled';
import LabelsControlPanel, { Props as LabelsProps } from './highlighted.labels.control.panel';
import { Column } from './styled';

export interface Props extends LabelsProps {
  clearStorage: DispatchAction<void>;
  syncWantList: DispatchAction<void>;
  syncCollection: DispatchAction<void>;
  logOut: DispatchAction<void>;
  isSyncing: boolean;
  inventory: Record<string, number>;
}

const Settings = ({
  clearStorage,
  syncWantList,
  syncCollection,
  isSyncing,
  logOut,
  inventory,
  highlightedLabels,
  setHighlightedLabels,
}: Props) => {
  const [resyncBtn, resyncExplained, collBtn, collExplained, binBtn, binExplained, logOutTxt] =
    getTexts(
      'settings.resync.btn',
      'settings.resync.explained',
      'settings.collection.sync.btn',
      'settings.collection.sync.explained',
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
          <p>
            {renderText('settings.inventory', { number: inventory.wantList, list: 'want list' })}
          </p>
        </Column>

        <Column>
          <Submit disabled={isSyncing} onClick={() => syncCollection()}>
            <Collection {...{ fill: discogsColors.white }} />
            {collBtn}
          </Submit>
          <p>{collExplained}</p>
          <p>
            {renderText('settings.inventory', { number: inventory.collection, list: 'collection' })}
          </p>
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
      <LabelsControlPanel {...{ highlightedLabels, setHighlightedLabels }} />
    </ContentBody>
  );
};

export const mapStateToProps = (state: RootState): StateProps<Partial<Props>> => ({
  isSyncing: isSyncing(state),
  highlightedLabels: appSelectors.getHighlightedLabels(state),
  inventory: getInventory(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    syncWantList: bindActionCreators(wantListActions.syncWantList, dispatch),
    syncCollection: bindActionCreators(wantListActions.syncCollection, dispatch),
    setHighlightedLabels: bindActionCreators(appActions.setHighlightedLabels, dispatch),
    clearStorage: bindActionCreators(appActions.clearStorage, dispatch),
    logOut: bindActionCreators(userActions.logOut, dispatch),
  } as Props);

export default connect(mapStateToProps, mapDispatchToProps)(Settings as FC<Partial<Props>>);
