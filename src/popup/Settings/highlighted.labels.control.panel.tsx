import { base, BrightCard, Row, TextArea } from '../styled'

import { HightlightedLabels } from '../../domain'
import { DispatchAction } from '../../services/redux/store'
import { renderText } from '../../services/texts'
import { colors } from '../styled'

import { useEffect, useState } from 'react'
import { Column, Preview } from './styled'

const { red, green } = colors.highlightedLabels
const splitted = (val: string = '') => val.split(/\n/).filter(Boolean)
const joined = (val: string[] = []) => val.filter(Boolean).join('\n')

export interface Props {
  setHightlightedLabels: DispatchAction<HightlightedLabels>
  hightlightedLabels: HightlightedLabels
}
const HightlightedLabelsControlPanel = ({
  setHightlightedLabels,
  hightlightedLabels,
}: Props) => {
  const [poor, setPoor] = useState('')
  const [fair, setFair] = useState('')
  const [good, setGood] = useState('')
  const [veryGood, setVeryGood] = useState('')

  useEffect(() => {
    setPoor(joined(hightlightedLabels.poor))
    setFair(joined(hightlightedLabels.fair))
    setGood(joined(hightlightedLabels.good))
    setVeryGood(joined(hightlightedLabels.veryGood))
  }, [hightlightedLabels])

  const onBlur = () => {
    setHightlightedLabels({
      poor: splitted(poor),
      fair: splitted(fair),
      good: splitted(good),
      veryGood: splitted(veryGood),
    })
  }

  const labels = [
    {
      label: 'poor',
      onChange: setPoor,
      value: poor,
      emphasize: red.strong,
    },
    {
      label: 'fair',
      onChange: setFair,
      value: fair,
      emphasize: red.soft,
    },
    {
      label: 'good',
      onChange: setGood,
      value: good,
      emphasize: green.soft,
    },
    {
      label: 'veryGood',
      onChange: setVeryGood,
      value: veryGood,
      emphasize: green.strong,
    },
  ]

  return (
    <>
      <BrightCard style={{ marginTop: base }}>
        <h3>Hightlighted labels</h3>
        <Row padding={[1, 0]} width={42}>
          <Column width={44}>
            {renderText('settigns.favourite.explained', {
              label: 'favoruite',
            })}
          </Column>
        </Row>
      </BrightCard>
      <Row width={44} padding={[1, 0, 0]}>
        {labels.map(({ label, onChange, value, emphasize }) => {
          return (
            <Column key={'highlight-favorite-column-' + label}>
              <Preview emphasize={emphasize}>
                {'Category: ' +
                  label.charAt(0).toUpperCase() +
                  label.slice(1).toLowerCase()}
              </Preview>

              <TextArea
                height={18}
                value={value}
                onBlur={onBlur}
                width={18}
                onChange={(e) => onChange(e.target.value)}
                placeholder={renderText('settigns.favourite.placeholder', {
                  label,
                })}
              ></TextArea>
            </Column>
          )
        })}
      </Row>
    </>
  )
}

export default HightlightedLabelsControlPanel
