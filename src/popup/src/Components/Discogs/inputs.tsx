import styled from 'styled-components'
import { base, colors, fontSizes } from '../styled'

export const Button = styled.button`
    -webkit-user-drag: none;
    background: ${colors.dark};
    border-radius: calc(${base} / 3);
    border: transparent;
    box-sizing: border-box;
    color: ${colors.white};
    cursor: pointer;
    display: inline-block;
    font-family: inherit;
    font-size: ${fontSizes.medium};
    letter-spacing: 0.01em;
    line-height: normal;
    margin: 0;
    overflow: visible;
    padding: calc(${base} / 2) ${base};
    text-align: center;
    text-decoration: none;
    text-shadow: 0 1px 1px ${colors.darkShade};
    text-transform: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
`

export const Select = styled.select`
    font-size: ${fontSizes.medium};
    line-height: 1.15;
    text-transform: none;
    font-family: Helvetica, Arial, sans-serif;
    letter-spacing: 0.01em;
    padding: calc(${base} / 2);
    box-shadow: inset 0 1px 3px ${colors.darkShade};
    border-radius: calc(${base} / 3);
    vertical-align: middle;
    box-sizing: border-box;
    height: 2.25em;
    border: 1px solid ${colors.black};
    background-color: ${colors.dark};
    color: ${colors.white};
    display: block;
    margin: 0;
`
