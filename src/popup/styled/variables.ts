import { ReactNode } from 'react'
export const base = '12px'
export const micro = '2px'

export const colors = {
  bright: '#6793a7',
  dark: '#282c34',
  darkShade: '#030405',
  black: '#111',
  white: '#ddd',
  shade: '#aaa',
  dread: '#880000',
  kindOfBlue: '#123654',
  blueInTheGreen: '#0b2a06',
  uglyYellow: '#f3ba15',
  highlightedLabels: {
    red: {
      soft: '#e28080',
      strong: '#760000',
    },

    green: {
      soft: '#6bd7a1',
      strong: '#0b2a06',
    },

    white: {
      soft: '#fffcfa',
      strong: '#FFF',
    },
  },
}

export const fontSizes = {
  small: base,
  medium: `calc(${base} + ${micro})`,
  large: `calc(${base} * 1.5)`,
  xLarge: `calc(${base} * 2)`,
  xxLarge: `calc(${base} * 3)`,
}

export const borderRadius = {
  small: `calc(${base} / 2)`,
  medium: `calc(${base} / 1.5)`,
  large: base,
}

export type Kids = { children?: ReactNode[] | ReactNode }
export type Size = { width?: number; height?: number }
export type Padded = { padding?: number[] }
export type Center = { center?: boolean }
export type Colors = { color?: string; background?: string }
export const spacings = {
  ...borderRadius,
}
