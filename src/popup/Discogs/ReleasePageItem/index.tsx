import maybe from '@hansogj/maybe';
import { FC, PropsWithChildren } from 'react';
import { ReleasePageItem } from '../../../domain';
import { Card, ContentBody, discogsColors } from '../../styled';
import ListItem from './ListPageItem';

export interface Props {
  releasePageItem: ReleasePageItem;
}

const WithReleasePageItem: FC<PropsWithChildren<Props>> = ({
  releasePageItem,
  children,
}: PropsWithChildren<Props>) => (
  <ContentBody filled>
    <Card color={discogsColors.bright} background="transparent">
      {maybe(releasePageItem)
        .mapTo('master')
        .map((releasePageItem) => <ListItem {...{ releasePageItem }} />)
        .valueOr(<></>)}
    </Card>
    {children}
  </ContentBody>
);

export default WithReleasePageItem;
