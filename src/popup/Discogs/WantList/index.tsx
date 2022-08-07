import maybe from 'maybe-for-sure'
import { FC, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { WantList } from '../../../domain'
import { RootState } from '../../../services/redux'
import {
  DispatchProps,
  getWantList,
  StateProps,
} from '../../../services/redux/selectors'
import { renderText } from '../../../services/texts'
import { Column, ContentBody, Row } from '../../styled'
import ControlPanel from './ControlPanel'
import List, { Props as ListProps } from './List'
import {
  entriesFrom,
  filteredAndSorted,
  SortMethod,
  SortMethods,
} from './utils'

import { actions as appActions } from '../../../services/redux/app'
import { actions as wantlistActions } from '../../../services/redux/wantlist'
import { DispatchAction } from '../../../services/redux/store'

export interface Props extends ListProps {
  wantList: WantList
  getSyncedWantlist: DispatchAction<void>
}

const WantListComponent: FC<Props> = ({
  wantList,
  goToUrl,
  getSyncedWantlist,
}: Props) => {
  const [sortMethod, selectSortMethod] = useState<SortMethod>('Added (rev)')
  const [pageSize, setPageSize] = useState<number>(25)
  const [pageNr, setPage] = useState<number>(0)
  const length = Object.entries(wantList).length
  const wantListLength = maybe(entriesFrom(wantList))
    .map((it) => it.length)
    .valueOr(0)

  const turnPage = (dir: number) => {
    return setPage(pageNr + dir)
  }

  useEffect(() => {
    getSyncedWantlist()
  }, [getSyncedWantlist])

  const CP = () => (
    <ControlPanel
      {...{
        selectSortMethod: (method: keyof SortMethods) => {
          setPage(0)
          selectSortMethod(method)
        },
        sortMethod,
        turnPage,
        pageSize,
        setPageSize: (newSize) => {
          setPage(0)
          setPageSize(newSize)
        },
        pageNr,
        wantListLength,
        firstPage: pageNr === 0,
        lastPage: pageSize * (pageNr + 1) >= wantListLength,
      }}
    />
  )

  return wantList ? (
    <ContentBody filled>
      <Row>
        <Column width={37}>
          <h3>
            {renderText('discogs.wantlist.header', {
              size: Math.min(pageSize, length),
              length: Object.entries(wantList).length,
            })}
          </h3>
        </Column>
      </Row>
      <CP />
      {maybe(filteredAndSorted(wantList, sortMethod, pageNr, pageSize))
        .map((entries) => <List {...{ entries, goToUrl }} />)
        .valueOr(<></>)}

      {pageSize > 99 && wantListLength > 99 && <CP />}
    </ContentBody>
  ) : (
    <></>
  )
}

export const mapStateToProps = (
  state: RootState,
): StateProps<Partial<Props>> => ({
  wantList: getWantList(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    goToUrl: bindActionCreators(appActions.goToUrl, dispatch),
    getSyncedWantlist: bindActionCreators(
      wantlistActions.getWantList,
      dispatch,
    ),
  } as Partial<Props>)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WantListComponent as FC<Partial<Props>>)

// export default WantListComponent;
