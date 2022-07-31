import maybe from "maybe-for-sure";

export const MOCKED_RELEASE_URL = [
  "https://www.discogs.com/release/11874869-Genesis-Selling-England-By-The-Pound",
  "https://www.discogs.com/release/10083775-Walter-Smith-III-Live-In-Paris",
  "https://www.discogs.com/master/298833-Benny-Golson-Groovin-With-Golson",
  "https://www.discogs.com/release/4382732-Magma-M%C3%ABkan%C3%AFk-Destrukt%C3%AFw-Kommand%C3%B6h",
  "https://www.discogs.com/user/murdrejg/collection",
  "https://www.discogs.com/release/11100619-Band-Of-Dogs-Band-Of-Dogs",
];

const itemNr = maybe(window.location.search)
  .map((it) =>
    it
      .replace("?", "")
      .split("&")
      .filter((param) => param.toLowerCase().includes("itemnr"))
      .shift()
  )

  .map((it) => it!.split("=").pop())
  .map((it) => parseInt(it!, 10))
  .valueOr(Math.floor(Math.random() * MOCKED_RELEASE_URL.length));

export const getMockRelease = () => MOCKED_RELEASE_URL[itemNr];
