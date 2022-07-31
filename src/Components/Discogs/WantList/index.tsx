import maybe from "maybe-for-sure";
import { FC, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { WantList } from "../../../domain";
import { RootState } from "../../../redux";
import {
  DispatchProps,
  getWantList,
  StateProps,
} from "../../../redux/selectors";
import { renderText } from "../../../services/texts";
import { Column, ContentBody, Row } from "../../styled";
import ControlPanel from "./ControlPanel";
import List, { Props as ListProps } from "./List";
import { entriesFrom, filteredAndSorted, SortMethod } from "./utils";

import { actions as appActions } from "../../../redux/app";

export interface Props extends ListProps {
  wantList: WantList;
}

const WantListComponent: FC<Props> = ({ wantList, goToUrl }: Props) => {
  const [sortMethod, selectSortMethod] = useState<SortMethod>("Added (rev)");
  const [pageSize, setPageSize] = useState<number>(25);
  const [pageNr, setPage] = useState<number>(0);
  const length = Object.entries(wantList).length;
  const wantListLength = maybe(entriesFrom(wantList))
    .map((it) => it.length)
    .valueOr(0);

  const turnPage = (dir: number) => setPage(pageNr + dir);

  return wantList ? (
    <ContentBody filled>
      <Row>
        <Column width={37}>
          <h3>
            {renderText("discogs.wantlist.header", {
              size: Math.min(pageSize, length),
              length: Object.entries(wantList).length,
            })}
          </h3>
        </Column>
      </Row>
      <ControlPanel
        {...{
          selectSortMethod,
          sortMethod,
          turnPage,
          pageSize,
          setPageSize,
          pageNr,
          wantListLength,
        }}
      />
      {maybe(filteredAndSorted(wantList, sortMethod, pageNr, pageSize))
        .map((entries) => <List {...{ entries, goToUrl }} />)
        .valueOr(<></>)}

      {pageSize > 99 && (
        <ControlPanel
          {...{
            selectSortMethod,
            sortMethod,
            turnPage,
            pageSize,
            setPageSize,
            pageNr,
            wantListLength,
          }}
        />
      )}
    </ContentBody>
  ) : (
    <></>
  );
};

export const mapStateToProps = (
  state: RootState
): StateProps<Partial<Props>> => ({
  wantList: getWantList(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    goToUrl: bindActionCreators(appActions.goToUrl, dispatch),
  } as Props);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WantListComponent as FC<Partial<Props>>);

// export default WantListComponent;
