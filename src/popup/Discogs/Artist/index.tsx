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

import { Artist } from '../../../domain';
import { renderText } from '../../../services/texts';
import Loader from '../../App/Loader';
import { Column, ContentBody, Row } from '../../styled';
import List, { ListItem, Props as ListProps } from '../List';

export interface Props extends ListProps {
  artist: Optional<Artist['name']>;
  collected: Optional<ListItem[]>;
  wanted: Optional<ListItem[]>;
}

export const ArtistComponent = ({ artist, collected, wanted, goToUrl }: Props) => {
  const header = (list: Optional<ListItem[]>, listName: string) =>
    maybe(list)
      .nothingIf((it) => it.length < 1)
      .map((entries) => (
        <Row padding={[2, 0, 0, 0]}>
          <Column>
            <h3>{renderText('artist.list.title', { listName, number: entries.length, artist })}</h3>
          </Column>
        </Row>
      ))
      .valueOr(<h3>{renderText('artist.list.empty', { listName, artist })}</h3>);

  return (
    <ContentBody filled>
      <Row {...{ width: 43 }}>
        <Loader {...{ cond: [collected, wanted].some((it) => it !== undefined) }}>
          {header(collected, 'collection')}
          <Row>
            <List {...{ entries: collected!, goToUrl }} />
          </Row>

          {header(wanted, 'wantlist')}
          <Row>
            <List {...{ entries: wanted!, goToUrl }} />
          </Row>

          {/*           <div>{render(collected, 'collection')}</div>
          <div>{render(wanted, 'wantlist')}</div> */}
        </Loader>
      </Row>
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
