import maybe from 'maybe-for-sure'
import { Release, ReleasePageItem } from '../domain'
import { DISCOGS_BASE_URL } from './redux/app'
import * as xhr from './xhr'

export const releasePage = (url: string): Promise<ReleasePageItem> => {
  const getItemUri = (reg: RegExp) =>
    maybe(url.split(reg))
      .map((it) => it.pop())
      .nothingIf((it) => it === undefined)
      .map((it) => `${it}`.split('-').shift())
      .map((it) => parseInt(it!, 10))
      .nothingIf(isNaN)
      .valueOr(undefined)

  const [releaseId, masterId] = [/\/release\//, /\/master\//].map(getItemUri)

  const itemUri = maybe(releaseId)
    .map((it) => `/releases/${it}`)
    .or(maybe(masterId).map((it) => `/masters/${it}`))
    .valueOr(undefined)

  return itemUri
    ? xhr
        .fetch(`${DISCOGS_BASE_URL}/${itemUri}`)
        .then(({ master_url, ...rest }: Release) =>
          master_url ? xhr.fetch(master_url) : rest,
        )
        .then((master: Release) => ({ master, releaseId } as any))
    : Promise.reject('cannot find a release on this page')
}
