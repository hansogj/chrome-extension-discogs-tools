import { FC } from 'react';
import { Collection, List, Settings } from '../../assets/icons';
import { MustHaveReleaseItem, View, Views } from '../../services/redux/app';
import { DispatchAction } from '../../services/redux/store';
import {
  base,
  Column as StyledColumn,
  discogsColors,
  micro,
  NavButton,
  Row as StyledRow,
  Thumb,
} from '../styled';

import maybe from 'maybe-for-sure';
import styled from 'styled-components';
import { DISCOGS_LOGO } from '../../constants';
import { User } from '../../domain';
import { Props as ReleasePageItemProps } from '../Discogs/ReleasePageItem';

const IconMap: Record<View, (fill: string) => JSX.Element> = {
  'Add Item': (fill: string) => <Collection {...{ fill }} />,
  'Want List': (fill: string) => <List {...{ fill }} />,
  Settings: (fill: string) => <Settings {...{ fill }} />,
};

export interface Props extends ReleasePageItemProps {
  activeView: View;
  setView: DispatchAction<View>;
  user: User;
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

const isDisabled = (view: View, releasePageItem: Props['releasePageItem']) =>
  !Boolean(releasePageItem) &&
  MustHaveReleaseItem.map((it) => it.toLowerCase()).includes(view.toLowerCase());

const Header: FC<Props> = ({ setView, activeView, releasePageItem, user }: Props) => {
  return (
    <Row>
      <ImgColumn>
        <img src={DISCOGS_LOGO} alt="Discogs Logo" />
      </ImgColumn>
      {Views.map((view) => ({
        view,
        disabled: isDisabled(view, releasePageItem),
        active: view === activeView && 'activeView',
      })).map(({ view, disabled, active }) => (
        <Column key={view} center>
          <>
            <NavButton
              className={[active && 'activeView', disabled && 'disabled'].filter(Boolean).join(' ')}
              disabled={disabled}
              onClick={() => !disabled && setView(view)}
            >
              {IconMap[view](active ? discogsColors.bright : discogsColors.white)}
              {view}
            </NavButton>
          </>
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
};

export default Header;
