import { FC } from 'react';
import { Collection, Head, List, Settings } from '../../../assets/icons';
import { AppActionData, View } from '../../../services/redux/app';
import { DispatchAction } from '../../../services/redux/store';
import {
  base,
  Column as StyledColumn,
  discogsColors,
  micro,
  NavButton,
  Row as StyledRow,
  Thumb,
} from '../../styled';

import maybe from '@hansogj/maybe';
import styled from 'styled-components';
import { DISCOGS_LOGO } from '../../../constants';
import { User } from '../../../domain';
import { SwitchedView } from '../../containers/App';

const IconMap: Record<View, (fill: string) => JSX.Element> = {
  Item: (fill: string) => <Collection {...{ fill }} />,
  Artist: (fill: string) => <Head style={{ color: fill }} />,
  'Want List': (fill: string) => <List {...{ fill }} />,
  Settings: (fill: string) => <Settings {...{ fill }} />,
};

export interface Props {
  setView: DispatchAction<Pick<AppActionData, 'view'>>;
  user?: User;
  views: SwitchedView[];
}

const Row = styled(StyledRow)`
  background-color: ${discogsColors.dark};
  margin-top: -${micro};
  justify-content: end;
`;

const Column = styled(StyledColumn)`
  justify-content: center;
`;

const ImgColumn = styled(Column)`
  margin-right: auto;
  padding-left: calc(${base} * 2);
  padding-top: ${base};
  img {
    height: calc(${base} * 4);
  }
`;

const Header: FC<Props> = ({ setView, views, user }: Props) => (
  <Row>
    <ImgColumn>
      <img src={DISCOGS_LOGO} alt="Discogs Logo" />
    </ImgColumn>
    {views &&
      views.map(({ view, isActive }) => (
        <Column key={view} center>
          <NavButton onClick={() => setView({ view })} className={isActive ? 'activeView' : ''}>
            {IconMap[view](isActive ? discogsColors.bright : discogsColors.white)}
            {view}
          </NavButton>
        </Column>
      ))}
    <Column>
      {maybe(user)
        .mapTo('avatar_url')
        .map((src) => <Thumb {...{ src, shade: false }} />)
        .valueOr(<></>)}
    </Column>
  </Row>
);

export default Header;
