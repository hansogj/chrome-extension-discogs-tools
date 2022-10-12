import maybe from '@hansogj/maybe';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Notification } from '../../services/redux/app';
import { base, Card, Column, ContentBody, discogsColors, Row, Button } from '../styled';

export interface Props {
  notification: Notification;
  refObject?: React.MutableRefObject<any>;
  height?: number;
  width?: number;
}

const NotificationContentBody = styled(ContentBody)<
  { error?: boolean } & Pick<Props, 'height' | 'width'>
>`
  position: fixed;
  width: ${(props) => props.width + 'px' || '100%'};
  height: ${(props) => props.height + 'px' || '100%'};
  justify-content: start;
  transition: 1s ease-in-out;
  background-color: ${discogsColors.darkTransparent};
  top: 0;
  left: 0;

  .card {
    min-width: calc(${base} * 20);
    padding: calc(${base} * 2);
    
    background-color: ${(props) =>
      props.error ? `${discogsColors.dread};` : `${discogsColors.green};`} 
    
    color: ${discogsColors.white};
    a {
        color: ${discogsColors.white};
    }
  }
`;

const NotificationComponent: FC<Props> = ({ notification, refObject }: Props) => {
  const [size, setSize] = useState({ width: 580, height: 50 });
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      maybe(refObject)
        .mapTo('current')
        .map((it) => (it as unknown as Element).getBoundingClientRect())
        .map(({ width, height }) => setSize({ width, height }))
        .valueOr({ width: 580, height: 50 });
    }, 200);
    return () => clearInterval(interval);
  }, [refObject]);

  return maybe(notification)
    .map(({ message, isError, error, actionBtn }) => ({
      __html: message || JSON.stringify(error),
      isError,
      actionBtn,
    }))
    .map(({ __html, isError, actionBtn }) => (
      <NotificationContentBody {...{ ...size, error: isError }}>
        <Row>
          <Column center width={46}>
            <Card className="card">
              <Row>
                <Column>
                  <div dangerouslySetInnerHTML={{ __html }} />
                </Column>
              </Row>

              {actionBtn && (
                <Row>
                  <Column center padding={[2, 0]}>
                    <Button onClick={() => dispatch(actionBtn.action)}>{actionBtn.text}</Button>
                  </Column>
                </Row>
              )}
            </Card>
          </Column>
        </Row>
      </NotificationContentBody>
    ))
    .valueOr(<></>);
};

export default NotificationComponent;
