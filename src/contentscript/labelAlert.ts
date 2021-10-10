import find from './util/find'
import { color } from './constants'

const badLabels = [
    'Abkco',
    'Abraxas',
    'Akarma',
    'Back To Black',
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
    'Waxtime In Color',
    'WaxTime',
    'ZYX',
]

const goodLabels = [
    'ACT',
    'AKT',
    'Analogue Productions',
    'Audio Fidelity',
    'Cisco',
    'Flightless',
    'Hubro',
    'Jazzland',
    'Mobile Fidelity',
    'Moserobie Music Production',
    'Riverside Records',
    'Rune Grammofon',
    'Seventh Records',
    'Soleil Zeuhl',
    "Speaker's Corner",
]

const labelAlert = (
    selector: string,
    labels: typeof badLabels | typeof goodLabels,
    soft: string,
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
              ${soft} 80px,
              transparent 10px,
              transparent 99.999999%
            )`

            return match
        })
;['.label_and_cat', '.collection-row'].forEach((selector) => {
    labelAlert(selector, badLabels, color.red.soft, color.red.strong)
    labelAlert(selector, goodLabels, color.green.soft, color.green.strong)
})
