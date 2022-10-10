import maybe from '@hansogj/maybe';
import React from 'react';

import { DispatchAction } from '../../../services/redux/store';
import { Column, Row, Size, Thumb } from '../../styled';
import { ReleaseCol } from './style';
import { ListItem } from './types';

export type Props = { entries: ListItem[]; goToUrl: DispatchAction<string> } & Size;

const List = ({ entries, goToUrl, width }: Props) =>
  maybe(entries)
    .map((it) => (
      <>
        {it.map(({ master_id, thumb, artists, title, year }: ListItem, i) => (
          <ReleaseCol key={`${master_id}_${i}`} width={12} height={8}>
            <a
              {...{ href: `http://www.discogs.com/${master_id}` }}
              onClick={() => goToUrl(`http://www.discogs.com/${master_id}`)}
            >
              <Row>
                <Column width={6} className="thumbContainer">
                  <Thumb src={thumb} alt={title} />
                </Column>
                <Column width={5}>
                  <Row>
                    <Column>
                      {artists.map(({ name }) => name).join('/')}
                      <br />
                      <i>{title}</i>
                      <br />
                      {year}
                      <br />
                    </Column>
                  </Row>
                </Column>
              </Row>
            </a>
          </ReleaseCol>
        ))}
      </>
    ))
    .valueOr(null);

export default List;
