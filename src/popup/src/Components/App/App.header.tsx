import React from 'react';
import styled from 'styled-components';
import { base, contentKidStyle } from '../styled';
import record from '../../assets/round-record.png';

const rpm33 = 60 / 33.3333;
const ContentHeader = styled.header`
  ${contentKidStyle};
  align-items: center;
`;

const AppLogo = styled.img`
  pointer-events: none;
  height: calc(${base} * 10);
  width: calc(${base} * 10);
  @media (prefers-reduced-motion: no-preference) {
    animation: App-logo-spin infinite ${rpm33}s linear;
  }


  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

const AppHeader = () => (
  <ContentHeader>
    <AppLogo src={record} alt="logo" />
  </ContentHeader>
);
export default AppHeader;
