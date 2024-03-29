import React, { FC } from 'react';
import { getText } from '../../../services/texts';
import { pageSizes, SortMethod, SortMethods, sortMethods } from '../../containers/WantList/utils';
import { Button, Column, Row, Select } from '../../styled';

export type Props = {
  sortMethod: keyof SortMethods;
  pageSize: number;
  pageNr: number;
  firstPage: boolean;
  lastPage: boolean;
  selectSortMethod: (sortMethod: SortMethod) => void;
  turnPage: (to: number) => void;
  setPageSize: (pageSize: number) => void;
  wantListLength: number;
};

const ControlPanel: FC<Props> = ({
  selectSortMethod,
  sortMethod,
  pageSize,
  turnPage,
  setPageSize,
  firstPage,
  lastPage,
}: Props) => (
  <Row>
    <Column width={4}>
      <Button disabled={firstPage} onClick={() => turnPage(-1)}>
        &lt;
      </Button>
    </Column>

    <Column width={17} center>
      <Select
        value={sortMethod}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          selectSortMethod(e.target.value as SortMethod);
        }}
        width={12}
      >
        {sortMethods.map((sm) => (
          <option key={`sort-method-${sm}`} value={sm}>
            {[sm === sortMethod && getText('discogs.wantlist.sort.by'), sm]
              .filter(Boolean)
              .join(' ')}
          </option>
        ))}
      </Select>
    </Column>

    <Column width={1}></Column>

    <Column width={17} center>
      <Select
        value={pageSize}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setPageSize(parseInt(e.target.value, 10));
        }}
        width={12}
      >
        {pageSizes.map((ps) => (
          <option key={`filter-page-size-${ps}`} value={ps}>
            {ps}
            {ps === pageSize && getText('discogs.wantlist.page.size')}
          </option>
        ))}
      </Select>
    </Column>

    <Column width={4}>
      <Button disabled={lastPage} onClick={() => turnPage(+1)}>
        &gt;
      </Button>
    </Column>
  </Row>
);

export default ControlPanel;
