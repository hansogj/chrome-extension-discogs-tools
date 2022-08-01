import { HightlightedLabels } from './domain'
// eslint-disable-next-line
export const isProduction = process.env.NODE_ENV === 'production'

export const DEFAULT_HIGHLIGHTED_LABELS: HightlightedLabels = {
    poor: [
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
    ],
    fair: [
        'Bad Joker',
        'joe jackson recoords',
        'Lilith',
        'Get Back',
        'Hi Hat',
        'Sanctuary Records',
        'Vinyl Magic (VM - BTF)',
    ],

    good: [
        'Analogue Productions',
        'Cisco',
        'EMC',
        'Flightless',
        'Hubro',
        'Riverside Records',
        'Rune Grammofon',
        "Speaker's Corner",
    ],
    veryGood: [
        'ACT',
        'AKT',
        'Audio Fidelity',
        'Blue Note',
        'Mobile Fidelity',
        'Moserobie Music Production',
        'Jazzland',
        'Seventh Records',
        'Soleil Zeuhl',
    ],
}
