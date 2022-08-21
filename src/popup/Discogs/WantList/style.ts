import styled from 'styled-components';
import { WantList } from '../../../domain';
import {
  AugmentetCol,
  base,
  borderRadius,
  Column,
  discogsColors,
  shade,
  spacings,
} from '../../styled';

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
    color: ${discogsColors.dark};
    width: calc(${base} * 12);
    &:hover {
      ${shade}
      border-radius: ${borderRadius.small};
      width: calc(${base} * 14);
      color: ${discogsColors.dark};
      display: inline-block;
      background-color: ${discogsColors.bright};
      filter: brightness(85%);
      padding: ${base};
    }
  }
`;
