import maybe from 'maybe-for-sure';
import { FC } from 'react';
import { Artist, Image, MasterRelease } from '../../../domain';
import { Column, Row, Thumb } from '../../styled';

export type Props = {
  releasePageItem: MasterRelease;
};

const ReleasePageItem: FC<Props> = ({ releasePageItem }: Props) =>
  maybe(releasePageItem)
    .map((it) => (
      <>
        {maybe(it.images)
          .nothingIf((it) => !it.length)
          .map((it) => it[0] as Image)
          .map(({ uri }: Image) => (
            <Row height={6} padding={[1, 0]} width={42}>
              <Column width={8}>
                <Thumb src={uri} alt="Thumb" />
              </Column>

              <Column width={30}>
                {maybe(it.artists)
                  .map((it) => it[0] as Artist)
                  .map(({ name }) => name)
                  .valueOr('')}
                <br />
                <i>{it.title}</i>
                <br />( {it.year})
              </Column>
            </Row>
          ))
          .valueOr(<></>)}
      </>
    ))
    .valueOr(<></>);

export default ReleasePageItem;
