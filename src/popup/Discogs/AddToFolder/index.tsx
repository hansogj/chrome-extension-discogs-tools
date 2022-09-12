import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../services/redux';

import maybe from '@hansogj/maybe';

import { FC } from 'react';
import { actions as foldersActions } from '../../../services/redux/folders';
import {
  DispatchProps,
  getCollectableFolders,
  getFields,
  getReleasePageItem,
  getSelectedFields,
  StateProps,
} from '../../../services/redux/selectors';
import { DispatchAction } from '../../../services/redux/store';
import { getText } from '../../../services/texts';
import { base, Card, Column, Row, Submit } from '../../styled';
import ReleasePageItem, { Props as ReleasePageItemProps } from '../ReleasePageItem';
import { disableSubmitBtn } from '../selectors';
import ListFields, { Props as ListFieldsProps } from './ListFields';
import ListFolders, { Props as ListFoldersProps } from './ListFolders';

export interface Props extends ListFoldersProps, ListFieldsProps, ReleasePageItemProps {
  addToFolder: DispatchAction<void>;
  disableSubmitBtn: boolean;
}

const AddToFolderComponent: FC<Props> = ({
  folders,
  fields,
  releasePageItem,
  disableSubmitBtn,
  addToFolder,
  ...props
}: Props) => {
  return (
    <ReleasePageItem releasePageItem={releasePageItem}>
      <Card style={{ marginTop: base }}>
        <Row padding={[1, 0]} width={42}>
          <Column width={21}>
            <ListFolders {...{ folders, ...props }} />
          </Column>

          {maybe(releasePageItem)
            .map((it) => (
              <Column padding={[1, 0, 0, 0]}>
                <Submit
                  {...{
                    title: getText(
                      disableSubmitBtn
                        ? 'discogs.add.to.folder.submit.disabled.message'
                        : 'discogs.add.to.folder.submit.message',
                    ),

                    disabled: disableSubmitBtn,
                    onClick: () => addToFolder(),
                  }}
                >
                  {getText('discogs.add.to.folder.submit')}
                </Submit>
              </Column>
            ))
            .valueOr(<Column padding={[1, 0, 0, 0]}>:Master:</Column>)}
        </Row>
        <ListFields {...{ fields, ...props }} />
      </Card>
    </ReleasePageItem>
  );
};
export const mapStateToProps = (state: RootState): StateProps<Partial<Props>> => ({
  folders: getCollectableFolders(state),
  disableSubmitBtn: disableSubmitBtn(state),
  fields: getFields(state),
  selectedFields: getSelectedFields(state),
  releasePageItem: getReleasePageItem(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    addToFolder: bindActionCreators(foldersActions.addToFolder, dispatch),
    setSelectedFields: bindActionCreators(foldersActions.setSelectedFields, dispatch),
  } as Props);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddToFolderComponent as FC<Partial<Props>>);
