import maybe from '@hansogj/maybe';
import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { base, borderRadius, discogsColors, shade } from '../../popup/styled';

const UrlList = styled.ul`
  ${shade}
  position: fixed;
  top: 0;
  left: calc(${base} * 53);
  max-width: calc(${base} * 53);
  padding: ${base};
  background: ${discogsColors.uglyYellow};
  border-radius: ${borderRadius.large};
  list-style: none;
  overflow: hidden;
  white-space: nowrap;
  a {
    color: ${discogsColors.green};
    &.selected {
      font-weight: bold;
      color: ${discogsColors.darkShade};
    }
  }
`;

export const MOCKED_URLS = [
  /*0*/ 'user/murdrejg/collection',
  /*1*/ 'master/298833-Benny-Golson-Groovin-With-Golson',
  /*2*/ 'release/11874869-Genesis-Selling-England-By-The-Pound',
  /*3*/ 'release/10083775-Walter-Smith-III-Live-In-Paris',
  /*4*/ 'release/4382732-Magma-M%C3%ABkan%C3%AFk-Destrukt%C3%AFw-Kommand%C3%B6h',
  /*5*/ 'release/11100619-Band-Of-Dogs-Band-Of-Dogs',
  /*6*/ 'release/3216584-Jethro-Tull-Stand-Up',
  /*7*/ 'artist/3068399-Horse-Lords',
  /*8*/ 'artist/179749-Magma-6',
  /*9*/ 'artist/97545-John-Coltrane',
  /*10*/ 'artist/12368-Dead-Can-Dance',
];

const getCurrent = () =>
  maybe(window.location)
    .mapTo('href')
    .map((it) => new URL(it))
    .mapTo('searchParams')
    .map((params) => params.get('itemNr'))
    .map((it) => parseInt(it!, 10));

export const MockLinks = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    getCurrent().map(setSelected);
  }, []);

  return (
    <UrlList>
      {MOCKED_URLS.map((href, i) => (
        <li key={`MOCKURL${i}`}>
          <a
            className={i === selected ? 'selected' : ''}
            onClick={() => setSelected(i)}
            href={`http://localhost:3000/?itemNr=${i}`}
          >
            [{i}] {href}
          </a>
        </li>
      ))}
    </UrlList>
  );
};

const getMockPage = () =>
  getCurrent()
    .orJust(Math.floor(Math.random() * MOCKED_URLS.length))
    .map((it) => MOCKED_URLS[it])
    .map((it) => 'https://www.discogs.com/' + it)
    .map((it) => {
      console.log('Mocked discogs page url: ', it);
      return it;
    })
    .valueOrThrow(new Error('Cannot generate mocked url'));
export default getMockPage;
