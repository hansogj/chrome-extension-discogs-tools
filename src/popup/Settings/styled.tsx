import { base, Column as StyledColumn, discogsColors, micro } from '../styled';

import styled from 'styled-components';
import { generatedCss } from '../../services/highlighted.labels.service';

export const Column = styled(StyledColumn)`
  width: calc(${base} * 18);
  justify-content: start;
  textarea {
    background-color: ${discogsColors.black};
    color: ${discogsColors.bright};
  }
`;

export const Preview = styled.h3<{ emphasize: string }>`
  background-image: ${({ emphasize }) => generatedCss(emphasize)};
  height: calc(${base} * 2);
  width: auto;
  margin: ${base} 0 !important;
`;
export const H3 = styled.h3`
  border-bottom: ${micro} solid ${discogsColors.dark};
`;
