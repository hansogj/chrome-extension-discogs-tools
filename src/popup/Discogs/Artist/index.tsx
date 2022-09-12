import { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../services/redux';
import {
  DispatchProps,
  getArtistName,
  getCollectedArtistReleases,
  getWantedArtistReleases,
  StateProps,
} from '../../../services/redux/selectors';

import maybe from '@hansogj/maybe';
import { actions as appActions } from '../../../services/redux/app';

import { Artist, WantList } from '../../../domain';
import { renderText } from '../../../services/texts';
import { Column, ContentBody, Row } from '../../styled';
import List, { Props as ListProps } from '../WantList/List';

export interface Props extends ListProps {
  artist: Artist['name'];
  collected: WantList;
  wanted: WantList;
}

export const ArtistComponent = ({ artist, collected, wanted, goToUrl }: Props) => {
  const render = (list: WantList, listName: string) =>
    maybe(list)
      .map(Object.entries)
      .nothingIf((it) => it.length < 1)
      .map((entries) => (
        <>
          <Row padding={[2, 0, 0, 0]}>
            <Column>
              <h3>{renderText('artist.list.title', { listName, artist })}</h3>
            </Column>
          </Row>
          <List {...{ entries, goToUrl }} width={43} />
        </>
      ))

      .valueOr(<h3>{renderText('artist.list.empty', { listName, artist })}</h3>);

  return (
    <ContentBody filled>
      {render(collected, 'collection')}
      {render(wanted, 'wantlist')}
    </ContentBody>
  );
};

export const mapStateToProps = (state: RootState): StateProps<Partial<Props>> => ({
  collected: getCollectedArtistReleases(state),
  wanted: getWantedArtistReleases(state),
  artist: getArtistName(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps<Props> =>
  ({
    goToUrl: bindActionCreators(appActions.goToUrl, dispatch),
  } as Partial<Props>);

export default connect(mapStateToProps, mapDispatchToProps)(ArtistComponent as FC<Partial<Props>>);
