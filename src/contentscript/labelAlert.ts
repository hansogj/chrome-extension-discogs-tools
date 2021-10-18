import { color } from './constants'
import find from './util/find'

const badLabels = [
    'Abkco',
    'Abraxas',
    'Akarma',
    'Back To Black',
    'DOL',
    'DOXY',
    'Jazz Wax',
    'Music on Vinyl',
    'Simply Vinyl',
    'Skorpio',
    'Tapestry',
    'Vinyl Lovers',
    'Waxtime In Color',
    'WaxTime',
    'ZYX',
]
const poorLabels = [
    'Bad Joker',
    'joe jackson recoords',
    'Lilith',
    'Get Back',
    'Hi Hat',
    'Sanctuary Records',
    'Vinyl Magic (VM - BTF)',
]

const goodLabels = [
    'Analogue Productions',
    'Cisco',
    'EMC',
    'Flightless',
    'Hubro',
    'Riverside Records',
    'Rune Grammofon',
    "Speaker's Corner",
]
const upperClassLabels = [
    'ACT',
    'AKT',
    'Audio Fidelity',
    'Blue Note',
    'Mobile Fidelity',
    'Moserobie Music Production',
    'Jazzland',
    'Seventh Records',
    'Soleil Zeuhl',
]

const labelAlert = (
    selector: string,
    labels: typeof badLabels | typeof goodLabels,
    strong: string
) =>
    find(selector)
        .map((listItem) => listItem as HTMLElement)
        .filter((listItem) =>
            labels.some((label) =>
                listItem.innerText.toLowerCase().match(label.toLowerCase())
            )
        )
        .map((match) => {
            // match.style = {...match.style, ...backgroundColor, {...border:  ['1px', 'solid'].concat(borderColor).join(' ')}
            //match.style.backgroundColor = backgroundColor

            match.style.backgroundImage = ` repeating-linear-gradient(
              135deg,
              ${strong},
              ${color.white.strong} 80px,
              transparent 10px,
              transparent 99.999999%
            )`

            return match
        })
;['.label_and_cat', '.collection-row', 'tr[class^="wantlist"]'].forEach(
    (selector) => {
        labelAlert(selector, badLabels, color.red.strong)
        labelAlert(selector, poorLabels, color.red.soft)
        labelAlert(selector, goodLabels, color.green.soft)
        labelAlert(selector, upperClassLabels, color.green.strong)
    }
)
