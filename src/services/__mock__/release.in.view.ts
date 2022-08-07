import maybe from 'maybe-for-sure'

const MOCKED_RELEASE_URL = [
  'https://www.discogs.com/release/11874869-Genesis-Selling-England-By-The-Pound',
  'https://www.discogs.com/release/10083775-Walter-Smith-III-Live-In-Paris',
  'https://www.discogs.com/master/298833-Benny-Golson-Groovin-With-Golson',
  'https://www.discogs.com/release/4382732-Magma-M%C3%ABkan%C3%AFk-Destrukt%C3%AFw-Kommand%C3%B6h',
  'https://www.discogs.com/user/murdrejg/collection',
  'https://www.discogs.com/release/11100619-Band-Of-Dogs-Band-Of-Dogs',
]

const getMockRelease = () =>
  //maybe(window.location.search)
  maybe('false')
    .map((it) =>
      it
        .replace('?', '')
        .split('&')
        .filter((param) => param.toLowerCase().includes('itemnr'))
        .shift(),
    )

    .map((it) => it!.split('=').pop())
    .map((it) => parseInt(it!, 10))
    .orJust(Math.floor(Math.random() * MOCKED_RELEASE_URL.length))
    .map((it) => MOCKED_RELEASE_URL[it])
    .map((it) => {
      console.log('Mocked discogs page url: ', it)
      return it
    })
    .valueOrThrow(new Error('Cannot generate mocked url'))
export default getMockRelease
