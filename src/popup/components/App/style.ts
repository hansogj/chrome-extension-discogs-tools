import styled from 'styled-components';
import { base, contentKidStyle } from '../../styled';

const rpm33 = 60 / 33.3333;
export const ContentHeader = styled.header`
  ${contentKidStyle};
  align-items: center;
`;

export const AppLogo = styled.img`
  opacity: 0.9;
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
