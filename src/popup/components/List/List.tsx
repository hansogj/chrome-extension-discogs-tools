import maybe from '@hansogj/maybe';
import React from 'react';

import { DispatchAction } from '../../../services/redux/store';
import { Column, Row, Thumb } from '../../styled';
import { ReleaseCol, Offset } from './style';
import { ListItem } from './types';

export type Props = { entries: ListItem[]; goToUrl: DispatchAction<string> } & Offset;

const pickUrl = (item: any) => item.resource_url || item.master_url;

const List = ({ entries, goToUrl, offset }: Props) =>
  maybe(entries)
    .map((it) => (
      <>
        {it.map(({ master_id, thumb, artists, title, year, ...props }: ListItem, i) => (
          <ReleaseCol
            {...{
              key: `${master_id}_${i}`,
              width: 12,
              height: 8,
              className: 'releaseCol',
              offset: offset,
              modulus: it.length % 3 || 3,
            }}
          >
            <a
              {...{ href: pickUrl(props) }}
              onClick={(e) => {
                e.preventDefault();
                return goToUrl(pickUrl(props));
              }}
            >
              <Row>
                <Column width={6} className="thumbContainer">
                  <Thumb src={thumb} alt={title} />
                </Column>
                <Column width={5}>
                  <Row>
                    <Column className="ellipse">
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
