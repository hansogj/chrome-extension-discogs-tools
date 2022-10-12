import styled, { css } from 'styled-components';

import bgImage from '../../assets/tt-col.png';
import { h, link } from './fonts';
import {
  base,
  borderRadius,
  Center,
  Colors,
  discogsColors,
  fontSizes,
  micro,
  Padded,
  Size,
  spacings,
} from './variables';

export const shade = css`
  box-shadow: ${borderRadius.medium} ${borderRadius.small} ${borderRadius.small}
    ${discogsColors.darkShade};
`;

export const darkerShade = css`
  box-shadow: ${borderRadius.medium} ${borderRadius.small} ${borderRadius.small}
    ${discogsColors.black};
`;

const centerRow = css<Center>`
  justify-content: ${(props) => (!!props.center ? 'space-evenly' : 'space-between')};
`;

export const size = css<Size>`
  width: ${(props) => (props.width ? `calc(${base} * ${props.width})` : 'auto')};
  height: ${(props) => (props.height ? `calc(${base} * ${props.height})` : 'auto')};
`;

export const padded = css<Padded>`
  padding: ${({ padding = [] }: Padded) => padding.map((p) => `calc(${base} * ${p})`).join(' ')}};
`;

export const colored = css<Colors>`
  ${(props) => props.background && 'background-color: ' + props.background};
  ${(props) => props.color && 'color: ' + props.color};
`;

export const contentKidStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: ${fontSizes.medium};
  color: ${discogsColors.dark};
`;

export const Container = styled.div`
  ${h};
  font-size: ${fontSizes.medium};
  background-color: ${discogsColors.dark};
  padding: 0 ${base} ${base} ${base};
  ${link}
`;

export const Content = styled.div`
  border-radius: ${borderRadius.medium};
  border: 1px solid ${discogsColors.black};
  color: ${discogsColors.dark};
  background-image: url(${bgImage});
  background-size: auto;
`;

export const ContentBody = styled.div<{ filled?: boolean }>`
  margin: 0;
  padding: ${base};
  align-items: start;
  width: auto;
  ${contentKidStyle};
  ${shade};
  ${(props) =>
    props.filled &&
    `
    border-radius: ${borderRadius.medium};
    background-color: ${discogsColors.darkTransparent};
    color: ${discogsColors.white};    
    
    `};
`;
export const Column = styled.div<Size & Padded & Center>`
  ${size};
  ${padded};
  display: flex;
  ${(props) => props.center && 'align-items: center'};
  flex-direction: column;
  margin: 0;
  justify-content: space-between;
`;

export const AugmentedCol = css`
  padding: ${base};
  margin-top: calc(${base} / 2);
  overflow: hidden;
  border-radius: ${borderRadius.small};
  background-color: ${discogsColors.bright};
`;

export const Row = styled.div<Size & Padded & Center & Colors>`
  ${colored};
  ${size};
  ${padded};
  ${centerRow};
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: ${micro} 0;
`;

export const Card = styled.div<Size & Padded & Colors>`
  background-color: ${discogsColors.F1};
  color: ${discogsColors.dark};
  border-radius: ${borderRadius.medium};
  padding: ${base};
  height: 100%;

  ${size};
  ${padded};
  ${colored};
`;

export const AlertCard = styled(Card)`
  background-color: ${discogsColors.dread};
  color: ${discogsColors.bright};
`;

export const Line = styled.hr`
  border-top: 1px solid ${discogsColors.darkShade};
  border-bottom: 1px solid ${discogsColors.darkShade};
  font-weight: 800;
  width: 100%;
  margin: ${spacings.small} 0;
  border-radius: ${borderRadius.medium};
  height: 1px;
  ${shade}
`;

export const Thumb = styled.img<{ shade?: boolean }>`
  height: calc(${base} * 6);
  width: calc(${base} * 6);
  ${(props) => props.shade !== false && shade}
`;
