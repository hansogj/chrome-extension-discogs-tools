import { HighlightedLabels } from './domain';
// eslint-disable-next-line
export const isProduction = process.env.NODE_ENV === 'production';

export const API_TIMEOUT = 5000;
export const NOTIFICATION_TIMEOUT = 5000;

export const MAX_LOGIN_ATTEMPTS = 2;

export const DISCOGS_BASE_URL = 'https://api.discogs.com';

export const DISCOGS_LOGO =
  'https://st.discogs.com/0cc662c5cb9e836fcd6010bc2a182f5e53a6d1e5/images/discogs-logo.svg';

export const DEFAULT_HIGHLIGHTED_LABELS: HighlightedLabels = {
  poor: [
    'Abkco',
    'Abraxas',
    'Akarma',
    'Back To Black',
    'DOL',
    'DOXY',
    'Fame',
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
    'Carisma',
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
    'ECM',
    'ECM Records',
    'Impulse!',
    'Jazzaway',
    'Jazzland',
    'Mobile Fidelity',
    'Moserobie Music Production',
    'Seventh Records',
    'Soleil Zeuhl',
  ],
};
