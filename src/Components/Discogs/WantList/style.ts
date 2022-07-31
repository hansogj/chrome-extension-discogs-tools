import styled from "styled-components";
import { WantList } from "../../../domain";
import {
  AugmentetCol,
  base,
  borderRadius,
  colors,
  Column,
  shade,
  spacings,
} from "../../styled";

export interface Props {
  wantList: WantList;
}

export const ReleaseCol = styled(Column)`
  ${AugmentetCol}

  &:hover {
    visible: none;
    overflow: visible;
    filter: brightness(85%);
  }
  .thumbContainer {
    margin-right: ${spacings.medium};
  }

  a {
    color: ${colors.dark};
    width: calc(${base} * 12);
    &:hover {
      ${shade}
      border-radius: ${borderRadius.small};
      width: calc(${base} * 14);
      color: ${colors.dark};
      display: inline-block;
      background-color: ${colors.bright};
      filter: brightness(85%);
      padding: ${base};
    }
  }
`;
