import { Card, Row, TextArea } from '../styled';

import { HighlightedLabels } from '../../domain';
import { DispatchAction } from '../../services/redux/store';
import { renderText } from '../../services/texts';
import { discogsColors, Column } from '../styled';

import { useEffect, useState } from 'react';
import { Column as ActionColumn, H3, Preview } from './styled';
import { AppActionData } from '../../services/redux/app';

const { red, green } = discogsColors.highlightedLabels;
const splitted = (val: string = '') => val.split(/\n/).filter(Boolean);
const joined = (val: string[] = []) => val.filter(Boolean).join('\n');

export interface Props {
  setHighlightedLabels: DispatchAction<Pick<AppActionData, 'highlightedLabels'>>;
  highlightedLabels: HighlightedLabels;
}
const HighlightedLabelsControlPanel = ({ setHighlightedLabels, highlightedLabels }: Props) => {
  const [poor, setPoor] = useState('');
  const [fair, setFair] = useState('');
  const [good, setGood] = useState('');
  const [veryGood, setVeryGood] = useState('');

  useEffect(() => {
    setPoor(joined(highlightedLabels.poor));
    setFair(joined(highlightedLabels.fair));
    setGood(joined(highlightedLabels.good));
    setVeryGood(joined(highlightedLabels.veryGood));
  }, [highlightedLabels]);

  const onBlur = () => {
    setHighlightedLabels({
      highlightedLabels: {
        poor: splitted(poor),
        fair: splitted(fair),
        good: splitted(good),
        veryGood: splitted(veryGood),
      },
    });
  };

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
  ];
  const __html = renderText('settings.favorite.explained', {
    label: 'favorite',
  });
  return (
    <>
      <Card style={{ marginTop: '36px' }}>
        <H3>Highlighted labels</H3>

        <Row>
          <Column width={40}>
            <div dangerouslySetInnerHTML={{ __html }} />
          </Column>
        </Row>
        <Row width={42} padding={[1, 0, 0]}>
          {labels.map(({ label, onChange, value, emphasize }) => (
            <ActionColumn key={'highlight-favorite-column-' + label}>
              <Preview emphasize={emphasize}>
                {'Category: ' + label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
              </Preview>

              <TextArea
                height={18}
                value={value}
                onBlur={onBlur}
                width={18}
                onChange={(e) => onChange(e.target.value)}
                placeholder={renderText('settings.favorite.placeholder', {
                  label,
                })}
              ></TextArea>
            </ActionColumn>
          ))}
        </Row>
      </Card>
    </>
  );
};

export default HighlightedLabelsControlPanel;
