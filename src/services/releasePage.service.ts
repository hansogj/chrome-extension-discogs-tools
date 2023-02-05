import maybe from '@hansogj/maybe';
import { DISCOGS_BASE_URL } from '../constants';
import { ArtistReleases, Release, ReleasePageItem } from '../domain';

import * as xhr from './xhr';

export interface PageResourceIds {
  artist: Optional<number>;
  master: Optional<number>;
  release: Optional<number>;
}
export const releasePage = ({
  release: releaseId,
  master: masterId,
}: PageResourceIds): Promise<ReleasePageItem> => {
  const itemUri = maybe(releaseId)
    .map((it) => `/releases/${it}`)
    .or(maybe(masterId).map((it) => `/masters/${it}`))
    .valueOr(undefined);

  return itemUri
    ? xhr
        .get(`${DISCOGS_BASE_URL}/${itemUri}`)
        .then(({ master_url, ...rest }: Release.DTO) => (master_url ? xhr.get(master_url) : rest))
        .then((master: Release.DTO) => ({ master, releaseId } as any))
    : Promise.reject('cannot find a release on this page');
};

export const artistPage = ({ artist: artistId }: PageResourceIds): Promise<ArtistReleases> =>
  artistId
    ? xhr.get(`${DISCOGS_BASE_URL}/artists/${artistId}/releases`)
    : Promise.reject('cannot find a release on this page');
