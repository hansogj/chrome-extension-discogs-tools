import { css } from 'styled-components';
import { base, discogsColors, fontSizes } from './variables';

export const link = css`
  a {
    color: ${discogsColors.dark};
    &:active,
    &:hover {
      color: ${discogsColors.F1};
    }
    &:active {
      text-decoration: none;
    }
  }
`;

export const h = css`
  h1 {
    font-family: 'Enriqueta', arial, serif;
    font-size: ${fontSizes.xxLarge};
    font-weight: 800;
    line-height: calc(${base} * 4);
    margin: 0 0 calc(${base} * 2);
  }

  h2 {
    font-family: 'Enriqueta', arial, serif;
    font-size: ${fontSizes.xLarge};
    font-weight: 800;
    line-height: calc(${base} * 0.5);
    margin: 0 0 calc(${base} * 1.5);
  }

  h3 {
    font-family: 'Enriqueta', arial, serif;
    font-size: ${fontSizes.large};
    font-weight: 600;
    line-height: calc(${base} * 2);
    margin: 0 0 calc(${base} * 1);
  }

  h4,
  h5,
  label {
    font-family: 'Enriqueta', arial, serif;
    font-size: ${fontSizes.medium};
    font-weight: 600;
    line-height: calc(${base} * 1.5);
    margin: 0;
  }
  label {
    text-align: left;
  }
`;
