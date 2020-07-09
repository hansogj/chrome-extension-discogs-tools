import styled, { css } from 'styled-components';
import turntable from '../assets/tt-close.2.jpg';

export const base = '12px';

export const colors = {
  dark: '#282c34',
  darkShade: '#030405',
  black: '#111',
  white: '#ddd',
  shade: '#aaa',
  dread: '#880000',
};

export const fontSizes = {
  small: base,
  medium: `calc(${base} + 2px)`,
  large: `calc(${base} + 3px)`,
};

export const contentKidStyle = css`
  display: flex;
  flex-direction: column;

  justify-content: center;
  font-size: ${fontSizes.medium};
  color: ${colors.white};
`;

export const Container = styled.div`
  font-size: ${fontSizes.medium};
  background-color: ${colors.dark};
  padding: ${base};
`;

export const Content = styled.div`
  border-radius: calc(${base} / 2);
  border: 1px solid ${colors.black};
  background-image: url(${turntable});
  background-size: auto;
`;

export const ContentBody = styled.div`
  margin-top: ${base};
  padding: 0 ${base};
  align-items: start;
  ${contentKidStyle};
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 2px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 2px 0;
  width: 100%;
`;
