import styled from 'styled-components';
import {
  AugmentedCol,
  base,
  borderRadius,
  darkerShade,
  Column,
  discogsColors,
  shade,
  spacings,
} from '../../styled';
export type Offset = { offset?: 'giveOffset' | 'noOffset' };

export const ReleaseCol = styled(Column)<Offset & { modulus: number }>`
  &.releaseCol {
    ${AugmentedCol}
    position: relative;
    &:hover {
      overflow: visible;
    }
    .thumbContainer {
      margin-right: ${spacings.medium};
    }

    .ellipse {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      max-height: calc(${base} * 8);
    }

    a {
      color: ${discogsColors.dark};
      width: calc(${base} * 12);
      &:hover {
        position: absolute;
        ${shade}
        border-radius: ${borderRadius.small};
        top: ${base};
        left: ${base};
        z-index: 2;
        width: calc(${base} * 14);
        color: ${discogsColors.bright};
        display: inline-block;
        background-color: ${discogsColors.darkTransparent};
        filter: brightness(85%);
        padding: ${base};

        .thumbContainer img {
          height: calc(${base} * 14);
          width: calc(${base} * 14);
          margin-bottom: calc(${base} * 2);
        }
        > div > div {
          width: auto;
        }
        img {
          ${darkerShade}
        }
        .ellipse {
          max-height: calc(${base} * 24);
        }
      }
    }

    &:nth-child(3n + ${(props) => (props.offset === 'giveOffset' ? 2 : 3)}) {
      color: red;
      a:hover {
        left: auto;
        right: ${base};
      }
    }

    ${({ modulus }) =>
      Array.from(Array(3 + modulus).keys()).map(
        (i) =>
          `&:nth-last-child(${i + 1}) {         
            a:hover {
              top: auto;    
              bottom:  calc(${base} * ${i >= modulus ? -11 : -1});
          }
        }
      `,
      )}
 
`;
