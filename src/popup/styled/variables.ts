import { ReactNode } from 'react';
export const base = '12px';
export const micro = '2px';

export const discogsColors = {
  dark: '#333333',
  darkTransparent: '#333333e6',
  black: '#000',
  white: '#FFF',
  bright: '#ccc',
  F1: '#F1F1F1',
  darkShade: '#030405',
  uglyYellow: '#F5DF2D',
  green: '#00800B',

  dread: '#BF3A38',

  disabled: {
    uglyYellow: '#fac936b5',
    green: '#505b51',
    dread: '#7f5251de',
  },

  highlightedLabels: {
    red: {
      soft: '#e28080',
      strong: '#760000',
    },

    green: {
      soft: '#5ea301',
      strong: '#0b2a06',
    },

    white: {
      soft: '#fffcfa',
      strong: '#FFF',
    },
  },
};

export const fontSizes = {
  small: base,
  medium: `calc(${base} + ${micro})`,
  large: `calc(${base} * 1.5)`,
  xLarge: `calc(${base} * 2)`,
  xxLarge: `calc(${base} * 3)`,
};

export const borderRadius = {
  small: `calc(${base} / 2)`,
  medium: `calc(${base} / 1.5)`,
  large: base,
};

export type Kids = { children?: ReactNode[] | ReactNode };
export type Size = { width?: number; height?: number };
export type Padded = { padding?: number[] };
export type Center = { center?: boolean };
export type Colors = { color?: string; background?: string };
export const spacings = {
  ...borderRadius,
};
