import styled, { css } from 'styled-components';
import React, { FC, PropsWithChildren, ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '../../assets/icons';
import { colored, padded, shade, size } from './styled';
import {
  borderRadius,
  Colors,
  discogsColors,
  fontSizes,
  micro,
  Padded,
  Size,
  spacings,
} from './variables';

const inputStyle = css`
  ${shade}
  background: ${discogsColors.dark};
  border-radius: ${borderRadius.medium};
  border: ${discogsColors.bright} ${micro} outset;
  box-sizing: border-box;
  color: ${discogsColors.bright};
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
    border: ${discogsColors.dark} ${micro} inset;
    box-shadow: none;
  }
`;

const activeButton = css`
  background: ${discogsColors.bright};
  border-radius: ${borderRadius.medium};
  border: ${discogsColors.dark} ${micro} outset;
  box-sizing: border-box;
  color: ${discogsColors.dark};
`;

const cursor = css`
  cursor: pointer;
  &:disabled,
  &.disabled {
    cursor: not-allowed;
  }
`;

export const Button = styled.button<
  Colors & {
    active?: boolean;
    loading?: boolean;
  }
>`
  ${cursor}
  ${colored}
  ${inputStyle};
  ${(props) => props.active && activeButton}

  text-shadow: 0 1px 1px ${discogsColors.darkShade};

  ${(props) =>
    !props.loading &&
    css`
      &:disabled,
      &:active {
        color: ${discogsColors.bright};
        text-shadow: 0 1px 1px ${discogsColors.darkShade};
      }
    `}
`;

export const NavButton = styled.nav<Colors & { active?: boolean; disabled?: boolean }>`
  ${cursor}
  ${colored}
  padding: calc(12px * 2) 12px;
  font-size: ${fontSizes.large};
  text-shadow: 0 1px 1px ${discogsColors.darkShade};
  color: ${discogsColors.white};

  &.activeView {
    color: ${discogsColors.bright};
    background-color: ${discogsColors.black};
    border-radius: ${spacings.small};
  }
  &.disabled {
    opacity: 0.5;
  }

  &:hover:not(.disabled) {
    ${shade};
    font-weight: 600;
    border-radius: ${borderRadius.small};
  }
`;

export const Submit = styled(Button)`
  background-color: ${discogsColors.green};
  color: ${discogsColors.white};
  &:disabled {
    background-color: ${discogsColors.disabled.green};
  }
`;

export const DreadButton = styled(Button)`
  background-color: ${discogsColors.dread};
  color: ${discogsColors.white};
  &:disabled {
    background-color: ${discogsColors.disabled.dread};
  }
`;

export const UglyButton = styled(Button)`
  background-color: ${discogsColors.uglyYellow};
  color: ${discogsColors.dark};
  &:disabled {
    background-color: ${discogsColors.disabled.uglyYellow};
  }
  text-shadow: none;
`;

export const Select = styled.select<Size & Padded & Colors>`
  ${inputStyle}
  ${size}
  ${padded}
  ${colored}
  text-align: right;
  option {
    color: ${discogsColors.white};
  }
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

type LoadButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  loading?: boolean;
};
export const LoadButton = ({
  icon,
  loading,
  children,
  ...props
}: PropsWithChildren<LoadButtonProps>) => {
  return (
    <Submit
      {...{
        ...props,
        disabled: props.disabled || loading,
      }}
    >
      <>
        {loading ? <Spinner {...{ fill: discogsColors.white }} /> : icon}
        {children}
      </>
    </Submit>
  );
};
