import find from './util/find';
import { color } from './constants';

const badLabels = [
  'Abkco',
  'Abraxas',
  'Akarma',
  'Bad Joker',
  'DOL',
  'DOXY',
  'Get Back',
  'Hi Hat',
  'Jazz Wax',
  'joe jackson recoords',
  'Lilith',
  'Music on Vinyl',
  'Sanctuary Records',
  'Simply Vinyl',
  'Skorpio',
  'Tapestry',
  'Vinyl Lovers',
  'Vinyl Magic (VM - BTF)',
  'WaxTime',
  'Waxtime In Color',
  'ZYX',
];

const goodLabels = [
  'Cisco',
  'Mobile Fidelity',
  'Analogue Productions',
  'Audio Fidelity',
  "Speaker's Corner",
  'Moserobie Music Production',
  'Riverside Records',
];

const labelAlert = (
  labels: typeof badLabels | typeof goodLabels,
  backgroundColor: string,
  borderColor: string
) => {
  find('.label_and_cat')
    .map((labelAndCat) => labelAndCat as HTMLElement)
    .filter((labelAndCat) =>
      labels.some((label) => labelAndCat.innerText.match(label))
    )
    .map((match) => {
      // match.style = {...match.style, ...backgroundColor, {...border:  ['1px', 'solid'].concat(borderColor).join(' ')}
      match.style.backgroundColor = backgroundColor;
      match.style.borderRadius = '5px';
      match.style.border = ['1px', 'solid'].concat(borderColor).join(' ');
      return match;
    });
};

labelAlert(badLabels, color.red.soft, color.red.strong);
labelAlert(goodLabels, color.green.soft, color.green.strong);
