import { AugmentetCol, base, Column as StyledColumn } from '../styled'

import styled from 'styled-components'
import { generatedCss } from '../../services/highlighted.labels.service'
import { colors } from '../styled'

export const Column = styled(StyledColumn)`
  ${AugmentetCol};
  color: ${colors.dark};
  width: calc(${base} * 18);
  textarea {
    background-color: ${colors.dark};
    color: ${colors.bright};
  }
`

export const Preview = styled.h3<{ emphasize: string }>`
  background-image: ${({ emphasize }) => generatedCss(emphasize)};
  height: calc(${base} * 2);
  width: auto;
  margin-bottom: ${base};
`
