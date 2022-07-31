import maybe from "maybe-for-sure";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Notification } from "../../redux/app";
import {
  base,
  Card,
  colors,
  Column,
  ContentBody,
  Row,
  Submit,
} from "../styled";

export interface Props {
  notification: Notification;

  refObject?: React.MutableRefObject<any>;
  height?: number;
  width?: number;
}

const NotificationContentBody = styled(ContentBody)<
  { error?: boolean } & Pick<Props, "height" | "width">
>`
  position: fixed;
  width: ${(props) => props.width + "px" || "100%"};
  height: ${(props) => props.height + "px" || "100%"};

  transition: 1s ease-in-out;
  background-color: ${(props) =>
    props.error ? `${colors.dread}80;` : `${colors.dark}80;`} 
  top: 0;
  left: 0;

  .card {
    min-width: calc(${base} * 20);
    padding: calc(${base} * 2);
    background-color: ${colors.bright};
    color: ${colors.kindOfBlue};
    a {
        color: ${colors.kindOfBlue};
    }
  }
`;

const NotificationComponent: FC<Props> = ({
  notification,
  refObject,
}: Props) => {
  const [size, setSize] = useState({ width: 580, height: 50 });
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      maybe(refObject)
        .mapTo("current")
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
        <Row center>
          <Column center width={46}>
            <Card className="card">
              <Row>
                <Column>
                  <div dangerouslySetInnerHTML={{ __html }} />
                </Column>
              </Row>

              {actionBtn && (
                <Row>
                  <Column center>
                    <Submit onClick={() => dispatch(actionBtn.action)}>
                      {actionBtn.text}
                    </Submit>
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
