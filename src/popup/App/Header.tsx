import { FC } from 'react';
import { Collection, Head, List, Settings } from '../../assets/icons';
import { MustHaveArtistReleases, MustHaveReleaseItem, View, Views } from '../../services/redux/app';
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

const IconMap: Record<View, (fill: string) => JSX.Element> = {
  Item: (fill: string) => <Collection {...{ fill }} />,
  Artist: (fill: string) => <Head />,
  'Want List': (fill: string) => <List {...{ fill }} />,
  Settings: (fill: string) => <Settings {...{ fill }} />,
};

export interface Props {
  activeView: View;
  setView: DispatchAction<View>;
  user: User;
  hasReleaseItems: boolean;
  hasArtistReleases: boolean;
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

const matchView = (mustHave: Array<View>, view: View) =>
  mustHave.map((it) => it.toLowerCase()).includes(view.toLowerCase());

const Header: FC<Props> = ({
  setView,
  activeView,
  hasReleaseItems,
  hasArtistReleases,
  user,
}: Props) => {
  const filterView = (view: View) =>
    ![
      !hasReleaseItems && matchView(MustHaveReleaseItem, view),
      !hasArtistReleases && matchView(MustHaveArtistReleases, view),
    ].some(Boolean);

  return (
    <Row>
      <ImgColumn>
        <img src={DISCOGS_LOGO} alt="Discogs Logo" />
      </ImgColumn>
      {Views.filter(filterView)
        .map((view) => ({ view, active: view === activeView && 'activeView' }))
        .map(({ view, active }) => (
          <Column key={view} center>
            <>
              <NavButton
                className={[active && 'activeView'].filter(Boolean).join(' ')}
                onClick={() => setView(view)}
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
