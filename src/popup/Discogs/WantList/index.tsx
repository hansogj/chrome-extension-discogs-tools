import { FC, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WantList } from '../../../domain';
import { RootState } from '../../../services/redux';
import { DispatchProps, getWantList, StateProps } from '../../../services/redux/selectors';
import { getTexts, renderText } from '../../../services/texts';
import { Column, ContentBody, Row } from '../../styled';
import List, { Props as ListProps } from '../List';
import ControlPanel from './ControlPanel';
import { filteredAndSorted, SortMethod, SortMethods } from './utils';

import maybe from '@hansogj/maybe';
import { actions as appActions } from '../../../services/redux/app';
import Loader from '../../App/Loader';

export interface Props extends ListProps {
  wantList: WantList.Item[];
}

const WantListComponent: FC<Props> = ({ wantList, goToUrl }: Props) => {
  const [sortMethod, selectSortMethod] = useState<SortMethod>('Added (rev)');
  const [pageSize, setPageSize] = useState<number>(25);
  const [pageNr, setPage] = useState<number>(0);

  const wantListLength = maybe(wantList).mapTo('length').valueOr(0);
  const turnPage = (dir: number) => setPage(pageNr + dir);

  const CP = () => (
    <ControlPanel
      {...{
        selectSortMethod: (method: keyof SortMethods) => {
          setPage(0);
          selectSortMethod(method);
        },
        sortMethod,
        turnPage,
        pageSize,
        setPageSize: (newSize) => {
          setPage(0);
          setPageSize(newSize);
        },
        pageNr,
        wantListLength,
        firstPage: pageNr === 0,
        lastPage: pageSize * (pageNr + 1) >= wantListLength,
      }}
    />
  );

  return (
    <ContentBody filled>
      <Row {...{ width: 43 }}>
        <Loader {...{ cond: !!wantList }}>
          {maybe(wantList)
            .nothingUnless((it) => !!it.length)
            .map((it) => (
              <>
                <Column>
                  <h3>
                    {renderText('discogs.wantlist.header', {
                      size: Math.min(pageSize, wantListLength),
                      length: wantListLength,
                    })}
                  </h3>
                </Column>
                <CP />
                {maybe(filteredAndSorted(wantList, sortMethod, pageNr, pageSize))
                  .map((entries) => <List {...{ entries, goToUrl, offset: 'giveOffset' }} />)
                  .valueOr(null)}
                {pageSize > 24 && wantListLength > 24 && <CP />}
              </>
            ))
            .valueOr(<h3>{getTexts('wantlist.empty')}</h3>)}
        </Loader>
      </Row>
    </ContentBody>
  );
};

export const mapStateToProps = (state: RootState): StateProps<Partial<Props>> => ({
  wantList: getWantList(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    goToUrl: bindActionCreators(appActions.goToUrl, dispatch),
  } as Partial<Props>);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WantListComponent as FC<Partial<Props>>);
