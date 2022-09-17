import { PropsWithChildren } from 'react';
import record from '../../assets/round-record.png';
import { ContentBody, Row } from '../styled';

import { AppLogo, ContentHeader } from './style';

const LoaderComponent = ({
  children = <></>,
  cond = false,
}: PropsWithChildren<{ cond?: boolean }>) =>
  cond ? (
    <>{children}</>
  ) : (
    <ContentBody>
      <Row width={43}>
        <ContentHeader style={{ width: '100%' }}>
          <AppLogo src={record} alt="logo" />
        </ContentHeader>
      </Row>
    </ContentBody>
  );

export default LoaderComponent;
