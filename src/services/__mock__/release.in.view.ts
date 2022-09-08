import maybe from 'maybe-for-sure';

const MOCKED_RELEASE_URL = [
  /*0*/ 'https://www.discogs.com/release/11874869-Genesis-Selling-England-By-The-Pound',
  /*1*/ 'https://www.discogs.com/release/10083775-Walter-Smith-III-Live-In-Paris',
  /*2*/ 'https://www.discogs.com/master/298833-Benny-Golson-Groovin-With-Golson',
  /*3*/ 'https://www.discogs.com/release/4382732-Magma-M%C3%ABkan%C3%AFk-Destrukt%C3%AFw-Kommand%C3%B6h',
  /*4*/ 'https://www.discogs.com/user/murdrejg/collection',
  /*5*/ 'https://www.discogs.com/release/11100619-Band-Of-Dogs-Band-Of-Dogs',
  /*6*/ 'https://www.discogs.com/release/3216584-Jethro-Tull-Stand-Up',
];

const getMockRelease = () =>
  maybe(window.location)
    .mapTo('href')
    .map((it) => new URL(it))
    .mapTo('searchParams')
    .map((params) => params.get('itemNr'))
    .map((it) => parseInt(it!, 10))
    .orJust(Math.floor(Math.random() * MOCKED_RELEASE_URL.length))
    .map((it) => MOCKED_RELEASE_URL[it])
    .map((it) => {
      console.log('Mocked discogs page url: ', it);
      return it;
    })
    .valueOrThrow(new Error('Cannot generate mocked url'));
export default getMockRelease;
