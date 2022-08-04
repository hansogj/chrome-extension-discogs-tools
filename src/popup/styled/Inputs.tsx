import styled, { css } from "styled-components";
import { shade, size, padded, colored } from "./styled";
import {
  borderRadius,
  colors,
  fontSizes,
  micro,
  Padded,
  Colors,
  Size,
  spacings,
} from "./variables";

const inputStyle = css`
  ${shade}
  background: ${colors.bright};
  border-radius: ${borderRadius.medium};
  border: ${colors.bright} ${micro} outset;
  box-sizing: border-box;
  color: ${colors.kindOfBlue};
  display: inline-block;
  font-family: inherit;
  font-size: ${fontSizes.medium};
  letter-spacing: 0.01em;
  line-height: normal;
  margin: 0;
  overflow: visible;
  padding: ${spacings.small} ${spacings.small};
  text-align: center;
  text-decoration: none;

  text-transform: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  &:hover {
    filter: brightness(125%);
  }
  &:active,
  &:focus-visible {
    border: ${colors.dark} ${micro} inset;
    box-shadow: none;
  }
`;

const activeButton = css`
  background: ${colors.kindOfBlue};
  border-radius: ${borderRadius.medium};
  border: ${colors.bright} ${micro} outset;
  box-sizing: border-box;
  color: ${colors.bright};
`;

export const Button = styled.button<
  Colors & {
    active?: boolean;
  }
>`
  ${colored}
  ${inputStyle};
  ${(props) => props.active && activeButton}
  text-shadow: 0 1px 1px ${colors.darkShade};
  cursor: pointer;

  &:disabled,
  &:active {
    filter: grayscale(1);
    text-shadow: 0 1px 1px ${colors.darkShade};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

export const Submit = styled(Button)`
  background-color: ${colors.blueInTheGreen};
  color: ${colors.bright};
`;

export const DreadButton = styled(Button)`
  background-color: ${colors.dread};
  color: ${colors.bright};
`;

export const UglyButton = styled(Button)`
  background-color: ${colors.uglyYellow};
  color: ${colors.bright};
`;

export const Select = styled.select<Size & Padded & Colors>`
  ${inputStyle}
  ${size}
  ${padded}
  ${colored}
  text-align: right;
`;

export const Input = styled.input<Size>`
  ${inputStyle}
  ${size}
`;

export const TextArea = styled.textarea<Size>`
  ${inputStyle}
  ${size}
  text-align: left;
`;
